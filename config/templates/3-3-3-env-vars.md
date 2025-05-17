# Environment Variables

- Use environment variables to override configuration for different environments (dev, test, prod).
- Prefix variables with the app name for clarity.
- Use `IConfiguration` to access env vars in .NET.

**Example:**
```sh
set MyApp__ConnectionStrings__DefaultConnection="..."
```

**Reference:**
- [Microsoft Docs: Environment variables in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/configuration-providers#environment-variables-configuration-provider)
