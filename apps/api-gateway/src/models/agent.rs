use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreateCommandRequest {
    pub command: String,
}
