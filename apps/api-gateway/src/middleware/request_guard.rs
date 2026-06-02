use actix_web::{error, web, Error, HttpResponse};
use serde_json::json;

pub fn json_config() -> web::JsonConfig {
  web::JsonConfig::default()
    .limit(16 * 1024)
    .error_handler(|error, _request| -> Error {
      error::InternalError::from_response(
        error,
        HttpResponse::BadRequest().json(json!({
          "error": "invalid_json_payload"
        })),
      )
      .into()
    })
}

