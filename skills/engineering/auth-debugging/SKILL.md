---
name: auth-debugging
description: 'Use for OAuth2, OIDC, Keycloak, SSO, service accounts, client credentials, bearer tokens, reverse-proxy auth, claim mapping or 401/403 failures.'
---

# Separate identity from authorization

A 401 and a 403 come from different layers. Find which component rejected the
request before changing anything.

## Stages

| Stage | Check |
| --- | --- |
| Endpoint | Token URL comes from `<issuer>/.well-known/openid-configuration` → `token_endpoint`. The service URL is not the token URL. |
| Grant | Client type and grant match (service accounts use client credentials; public clients use auth code with PKCE). |
| Token | Decode locally, never print it. Check `iss`, `aud`, `azp`, `exp`, scopes, roles, groups. Decoding does not validate. |
| Transport | Proxy, redirects, which host (a gateway hostname and the service hostname can enforce different rules). |
| Validation | Who verifies the token: the app, a reverse proxy, a sidecar? Which audiences and groups does it accept? |
| Authorization | Role or group mapping in the application, independent of a valid token. |

## Method

1. Record client ID, issuer, target host, method and path. Status codes and
   redacted error text only.
2. Reproduce the smallest request: one GET with the token.
3. **Compare like with like.** When "it works for them", confirm the same client
   ID, secret, host and HTTP method before concluding anything.
4. **Re-test before concluding.** Access granted on the identity side can take
   effect later; an old failure is not current evidence.
5. Fix the smallest authorized misconfiguration and re-run the same request,
   plus a negative case when feasible.

## Do not

- Disable TLS, bypass auth, share accounts or grant broad admin roles to make it pass.
- Paste secrets or tokens into chat, files, tickets or commits.
- Treat every 403 as a wrong password.
