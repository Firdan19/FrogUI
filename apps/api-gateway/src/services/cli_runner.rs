use std::process::Stdio;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;
use tokio::sync::mpsc;
use tokio_stream::wrappers::ReceiverStream;
use actix_web::web::Bytes;

use crate::Config;

pub async fn run_agent_cli(
    config: &Config,
    _task_id: &str,
    command: &str,
) -> Result<ReceiverStream<Result<Bytes, String>>, String> {
    
    // We execute the configured CLI script. We pass the user's command as an argument.
    // e.g. ./scripts/run_agent.sh "user command"
    let mut cmd = Command::new(&config.agent_cli_command);
    cmd.arg(command);
    
    cmd.stdout(Stdio::piped());
    cmd.stderr(Stdio::piped());

    let mut child = match cmd.spawn() {
        Ok(c) => c,
        Err(e) => return Err(format!("Failed to spawn agent CLI: {}", e)),
    };

    let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;
    let stderr = child.stderr.take().ok_or("Failed to capture stderr")?;

    let (tx, rx) = mpsc::channel(100);

    // Read stdout
    let tx_out = tx.clone();
    tokio::spawn(async move {
        let mut reader = BufReader::new(stdout).lines();
        while let Ok(Some(line)) = reader.next_line().await {
            let json_data = serde_json::json!({ "content": line });
            let msg = format!("event: stdout\ndata: {}\n\n", json_data);
            let _ = tx_out.send(Ok(Bytes::from(msg))).await;
        }
    });

    // Read stderr
    let tx_err = tx.clone();
    tokio::spawn(async move {
        let mut reader = BufReader::new(stderr).lines();
        while let Ok(Some(line)) = reader.next_line().await {
            let json_data = serde_json::json!({ "content": line });
            let msg = format!("event: stderr\ndata: {}\n\n", json_data);
            let _ = tx_err.send(Ok(Bytes::from(msg))).await;
        }
    });

    // Wait for process to exit
    let tx_exit = tx.clone();
    tokio::spawn(async move {
        match child.wait().await {
            Ok(status) => {
                let json_data = serde_json::json!({ "content": format!("Process exited with status: {}", status) });
                let msg = format!("event: exit\ndata: {}\n\n", json_data);
                let _ = tx_exit.send(Ok(Bytes::from(msg))).await;
            }
            Err(e) => {
                let json_data = serde_json::json!({ "content": format!("Process error: {}", e) });
                let msg = format!("event: error\ndata: {}\n\n", json_data);
                let _ = tx_exit.send(Ok(Bytes::from(msg))).await;
            }
        }
    });

    Ok(ReceiverStream::new(rx))
}
