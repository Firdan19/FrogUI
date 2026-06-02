use actix_web::{get, web, Error, HttpResponse};
use async_stream::stream;
use bytes::Bytes;
use futures_util::StreamExt;
use serde_json::json;

use crate::services::cli_runner;
use crate::AppState;

#[get("/api/stream/{task_id}")]
pub async fn stream_task(path: web::Path<String>, state: web::Data<AppState>) -> HttpResponse {
    let task_id = path.into_inner();
    let config = state.config.clone();
    let command = {
        let mut tasks = state.pending_tasks.lock().await;
        tasks.remove(&task_id)
    };

    let stream = stream! {
      yield Ok::<Bytes, Error>(sse_event("queued", json!({
        "task_id": task_id.clone(),
        "message": "Task stream opened."
      })));

      match command {
        Some(command) => {
          yield Ok::<Bytes, Error>(sse_event("gateway", json!({
            "task_id": task_id.clone(),
            "message": "Gateway validated command and is executing the agent CLI."
          })));

          match cli_runner::run_agent_cli(&config, &task_id, &command).await {
            Ok(mut response) => {
              while let Some(chunk_result) = response.next().await {
                match chunk_result {
                  Ok(bytes) => {
                    yield Ok::<Bytes, Error>(bytes);
                  }
                  Err(e) => {
                    yield Ok::<Bytes, Error>(sse_event("error", json!({
                      "task_id": task_id.clone(),
                      "message": format!("Stream interrupted: {e}")
                    })));
                    break;
                  }
                }
              }
            }
            Err(error) => {
              yield Ok::<Bytes, Error>(sse_event("error", json!({
                "task_id": task_id.clone(),
                "message": error
              })));
            }
          }
        }
        None => {
          yield Ok::<Bytes, Error>(sse_event("error", json!({
            "task_id": task_id.clone(),
            "message": "No pending command was found for this task."
          })));
        }
      }
    };

    HttpResponse::Ok()
        .insert_header(("Content-Type", "text/event-stream"))
        .insert_header(("Cache-Control", "no-cache"))
        .insert_header(("Connection", "keep-alive"))
        .streaming(stream)
}

fn sse_event(event: &str, payload: serde_json::Value) -> Bytes {
    Bytes::from(format!("event: {event}\ndata: {payload}\n\n"))
}
