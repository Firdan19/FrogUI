use actix_web::{dev::Payload, FromRequest, HttpRequest};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::future::{ready, Ready};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub role: String,
    pub exp: usize,
}

pub struct AuthenticatedUser {
    pub claims: Claims,
}

impl FromRequest for AuthenticatedUser {
    type Error = actix_web::Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, payload: &mut Payload) -> Self::Future {
        // Try extracting Bearer auth
        let auth = match BearerAuth::from_request(req, payload).into_inner() {
            Ok(auth) => auth,
            Err(e) => return ready(Err(e.into())),
        };

        // In a real app, JWT_SECRET should be parsed globally at startup.
        // For simplicity, we just grab it here.
        let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "dummy_secret".to_string());

        let validation = Validation::default();
        let token_data = match decode::<Claims>(
            auth.token(),
            &DecodingKey::from_secret(secret.as_bytes()),
            &validation,
        ) {
            Ok(c) => c,
            Err(_) => return ready(Err(actix_web::error::ErrorUnauthorized("Invalid Token"))),
        };

        ready(Ok(AuthenticatedUser {
            claims: token_data.claims,
        }))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::test;
    use jsonwebtoken::{encode, EncodingKey, Header};
    use std::time::{SystemTime, UNIX_EPOCH};

    fn create_token(sub: &str, role: &str, exp: usize, secret: &str) -> String {
        let claims = Claims {
            sub: sub.to_string(),
            role: role.to_string(),
            exp,
        };
        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(secret.as_bytes()),
        )
        .unwrap()
    }

    #[actix_web::test]
    async fn test_valid_token() {
        std::env::set_var("JWT_SECRET", "test_secret");
        let exp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as usize
            + 3600;
        let token = create_token("user123", "admin", exp, "test_secret");

        let req = test::TestRequest::default()
            .insert_header(("Authorization", format!("Bearer {}", token)))
            .to_http_request();

        let mut payload = actix_web::dev::Payload::None;
        let auth = AuthenticatedUser::from_request(&req, &mut payload)
            .await
            .unwrap();

        assert_eq!(auth.claims.sub, "user123");
        assert_eq!(auth.claims.role, "admin");
    }

    #[actix_web::test]
    async fn test_invalid_signature() {
        std::env::set_var("JWT_SECRET", "test_secret");
        let exp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as usize
            + 3600;
        let token = create_token("user123", "admin", exp, "wrong_secret");

        let req = test::TestRequest::default()
            .insert_header(("Authorization", format!("Bearer {}", token)))
            .to_http_request();

        let mut payload = actix_web::dev::Payload::None;
        let res = AuthenticatedUser::from_request(&req, &mut payload).await;

        assert!(res.is_err());
    }

    #[actix_web::test]
    async fn test_expired_token() {
        std::env::set_var("JWT_SECRET", "test_secret");
        let exp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as usize
            - 3600;
        let token = create_token("user123", "admin", exp, "test_secret");

        let req = test::TestRequest::default()
            .insert_header(("Authorization", format!("Bearer {}", token)))
            .to_http_request();

        let mut payload = actix_web::dev::Payload::None;
        let res = AuthenticatedUser::from_request(&req, &mut payload).await;

        assert!(res.is_err());
    }
}
