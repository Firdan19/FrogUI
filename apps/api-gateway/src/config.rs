#[derive(Clone, Debug)]
pub struct Config {
  pub gateway_host: String,
  pub gateway_port: u16,
  pub core_engine_url: String,
  pub redis_url: String,
  pub database_url: String,
}

impl Config {
  pub fn from_env() -> Self {
    Self {
      gateway_host: std::env::var("GATEWAY_HOST").unwrap_or_else(|_| "0.0.0.0".to_owned()),
      gateway_port: std::env::var("GATEWAY_PORT")
        .ok()
        .and_then(|value| value.parse::<u16>().ok())
        .unwrap_or(3001),
      core_engine_url: std::env::var("CORE_ENGINE_URL").unwrap_or_else(|_| "http://127.0.0.1:8080".to_owned()),
      redis_url: std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_owned()),
      database_url: std::env::var("DATABASE_URL").unwrap_or_else(|_| "postgres://frogui:frogui_dev_password@127.0.0.1:5432/frogui".to_owned()),
    }
  }
}

