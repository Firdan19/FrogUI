use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct CreateCommandRequest {
  pub command: String,
}
