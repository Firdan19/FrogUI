#[allow(dead_code)]
#[derive(Debug)]
pub enum AgentStreamEvent {
    Queued,
    Gateway,
    Memory,
    Inference,
    Complete,
    Error,
}

#[allow(dead_code)]
impl AgentStreamEvent {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Queued => "queued",
            Self::Gateway => "gateway",
            Self::Memory => "memory",
            Self::Inference => "inference",
            Self::Complete => "complete",
            Self::Error => "error",
        }
    }
}
