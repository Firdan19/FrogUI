use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct CreateCommandRequest {
  pub command: String,
}

#[derive(Debug, Serialize)]
pub struct CoreAgentRequest {
  pub task_id: String,
  pub command: String,
}


