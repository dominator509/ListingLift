# ENVIRONMENT.md

Use `.env.example` as the source of required variables. Use fake placeholders only in committed files.

Baseline defaults:

- Mock image provider enabled.
- Real provider calls disabled.
- Mock integrations enabled.
- Real integrations disabled.
- Rate limiting enabled.

Run:

```bash
npm run verify-env
```
