#[allow(dead_code)]
#[derive(Debug)]
pub struct SemanticMemoryQuery {
    pub query: String,
    pub limit: u16,
}

#[allow(dead_code)]
impl SemanticMemoryQuery {
    pub fn new(query: impl Into<String>) -> Self {
        Self {
            query: query.into(),
            limit: 8,
        }
    }
}
