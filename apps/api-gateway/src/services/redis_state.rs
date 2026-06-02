use redis::AsyncCommands;

pub async fn store_task(redis_url: &str, task_id: &str, command: &str) -> Result<(), String> {
    let client = redis::Client::open(redis_url).map_err(|error| error.to_string())?;
    let mut connection = client
        .get_multiplexed_async_connection()
        .await
        .map_err(|error| error.to_string())?;

    let stream_key = "frogui:task_stream";
    let items = &[
        ("task_id", task_id),
        ("command", command),
        ("status", "queued"),
    ];

    // XADD to stream with auto-generated ID (*)
    connection
        .xadd(stream_key, "*", items)
        .await
        .map_err(|error| error.to_string())
}
