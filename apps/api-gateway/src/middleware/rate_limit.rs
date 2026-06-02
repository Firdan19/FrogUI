use std::time::Duration;

#[derive(Clone, Copy, Debug)]
pub struct RateLimitPolicy {
  pub max_requests: u32,
  pub window: Duration,
}

impl Default for RateLimitPolicy {
  fn default() -> Self {
    Self {
      max_requests: 120,
      window: Duration::from_secs(60),
    }
  }
}

