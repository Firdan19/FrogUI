#[derive(Clone, Debug)]
pub struct Config {
    pub gateway_host: String,
    pub gateway_port: u16,
    pub agent_cli_command: String,
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
            agent_cli_command: std::env::var("AGENT_CLI_COMMAND")
                .unwrap_or_else(|_| "./scripts/run_agent.sh".to_owned()),
            redis_url: std::env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://127.0.0.1:6379".to_owned()),
            database_url: std::env::var("DATABASE_URL").unwrap_or_else(|_| {
                "postgres://frogui:frogui_dev_password@127.0.0.1:5432/frogui".to_owned()
            }),
        }
    }
}
