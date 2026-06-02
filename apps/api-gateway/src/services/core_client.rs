use awc::{Client, ClientResponse};
use futures_util::stream::Stream;
use actix_web::web::Bytes;
use crate::Config;
use crate::models::agent::CoreAgentRequest;

pub async fn run_agent(
  config: &Config,
  task_id: &str,
  command: &str,
) -> Result<ClientResponse<impl Stream<Item = Result<Bytes, awc::error::PayloadError>>>, String> {
  let url = format!("{}/v1/agent/run", config.core_engine_url.trim_end_matches('/'));
  let payload = CoreAgentRequest {
    task_id: task_id.to_owned(),
    command: command.to_owned(),
  };

  let response = Client::default()
    .post(url)
    .send_json(&payload)
    .await
    .map_err(|error| format!("core_engine_unreachable: {error}"))?;

  if !response.status().is_success() {
    return Err(format!("core_engine_error_status: {}", response.status()));
  }

  Ok(response)
}

