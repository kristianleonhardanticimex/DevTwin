# Configuration & Secrets

- Store configuration in `appsettings.json` and environment variables.
- Use strongly-typed options classes with `IOptions<T>`.
- Never hardcode secrets; use [User Secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) for local dev and Azure Key Vault for production.
- Override config with environment variables for cloud-native deployments.

**Reference:**
- [Microsoft Docs: Configuration in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/)
