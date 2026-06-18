# DEPLOYMENT.md

Deployment must not proceed until:

- Environment validation passes.
- Production secrets are configured securely.
- Real integrations are intentionally enabled.
- Mock-only dev behavior is disabled or explicitly approved.
- Auth, RBAC, tenant isolation, upload security, delivery token security, and webhook verification tests pass.
