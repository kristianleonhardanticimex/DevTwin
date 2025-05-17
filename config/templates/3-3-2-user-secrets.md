# User Secrets

- Use [dotnet user-secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) for local development secrets.
- Never commit secrets to source control.
- Access secrets via configuration providers in .NET.

**Commands:**
```sh
dotnet user-secrets init
dotnet user-secrets set "MySecret" "secret-value"
```

**Reference:**
- [Microsoft Docs: Safe storage of app secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets)
