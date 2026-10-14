# SECURITY

This file describes how to handle secrets and what to do if secrets are accidentally exposed.

1) Never commit secrets
 - Do not commit `.env` files, private keys, or any credentials into the repository.
 - Use `.env.example` to show variable names only.

2) Use secret storage for production
 - Use your hosting provider's secret manager (Render, Heroku, Vercel, AWS Secrets Manager, etc.).
 - Inject secrets into runtime via environment variables.

3) Bcrypt salt rounds
 - Configure bcrypt cost via SALT_ROUNDS (default 12).
 - Store this value in environment variables if you need to change it per deployment.

4) If secrets are exposed (incident response)
 - Treat the secrets as compromised and rotate them immediately:
   - Change DB user/password and rotate any connection strings.
   - Generate a new JWT_SECRET and invalidate existing tokens (rotate signing key).
   - Rotate any API keys / third-party secrets.
 - Inspect logs for suspicious access and audit DB/hosting access logs.
 - Re-deploy services with the new secrets.

5) Reporting a security issue
 - If you find a security issue in the code, open an issue with the "security" label or contact the repository owner privately.
