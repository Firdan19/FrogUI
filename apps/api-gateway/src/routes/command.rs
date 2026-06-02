use actix_web::{post, web, HttpResponse, Responder};
use serde_json::json;
use uuid::Uuid;

use crate::middleware::auth::AuthenticatedUser;
use crate::models::agent::CreateCommandRequest;
use crate::services::redis_state;
use crate::AppState;

#[post("/api/command")]
pub async fn create_command(
    user: AuthenticatedUser,
    state: web::Data<AppState>,
    request: web::Json<CreateCommandRequest>,
) -> impl Responder {
    let command = request.command.trim();
    if command.is_empty() {
        return HttpResponse::BadRequest().json(json!({
          "error": "command_required"
        }));
    }

    let task_id = Uuid::new_v4().to_string();
    {
        let mut tasks = state.pending_tasks.lock().await;
        tasks.insert(task_id.clone(), command.to_owned());
    }

    // Audit log
    if let Err(e) = crate::services::audit::log_action(
        &state.db_pool,
        &task_id,
        &user.claims.sub,
        "command_received",
        json!({ "command": command }),
    )
    .await
    {
        log::error!("Failed to write audit log: {}", e);
    }

    if let Err(error) = redis_state::store_task(&state.config.redis_url, &task_id, command).await {
        log::warn!("Redis task state was not stored: {error}");
    }

    HttpResponse::Accepted().json(json!({
      "task_id": task_id,
      "status": "queued",
      "stream_url": format!("/api/stream/{task_id}")
    }))
}
