use sqlx::PgPool;

pub async fn log_action(
    pool: &PgPool,
    task_id: &str,
    actor: &str,
    action: &str,
    payload: serde_json::Value,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO agent_audit_log (task_id, actor, action, payload)
        VALUES ($1, $2, $3, $4)
        "#,
    )
    .bind(task_id)
    .bind(actor)
    .bind(action)
    .bind(payload)
    .execute(pool)
    .await?;

    Ok(())
}
