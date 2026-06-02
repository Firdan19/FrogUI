mod config;
mod middleware;
mod models;
mod routes;
mod services;

use std::collections::HashMap;
use std::sync::Arc;

use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpServer};
use tokio::sync::Mutex;

use crate::config::Config;

#[derive(Clone)]
pub struct AppState {
  pub config: Config,
  pub pending_tasks: Arc<Mutex<HashMap<String, String>>>,
  pub db_pool: sqlx::PgPool,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  dotenvy::dotenv().ok();
  env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

  let config = Config::from_env();
  let bind_address = format!("{}:{}", config.gateway_host, config.gateway_port);

  let db_url = std::env::var("DATABASE_URL")
    .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/frogui".to_string());
  let db_pool = services::db::init_db(&db_url).await.expect("Failed to create Postgres pool");

  let state = AppState {
    config,
    pending_tasks: Arc::new(Mutex::new(HashMap::new())),
    db_pool,
  };

  log::info!("FrogUI API Gateway listening on {bind_address}");

  HttpServer::new(move || {
    App::new()
      .wrap(Logger::default())
      .wrap(Cors::permissive())
      .app_data(web::Data::new(state.clone()))
      .app_data(middleware::request_guard::json_config())
      .service(routes::health::health)
      .service(routes::command::create_command)
      .service(routes::sse::stream_task)
  })
  .bind(bind_address)?
  .run()
  .await
}

