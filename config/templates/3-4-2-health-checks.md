# Health Checks

- Use `AspNetCore.Diagnostics.HealthChecks` to implement readiness and liveness endpoints.
- Expose `/health` endpoint for monitoring.
- Add checks for database, cache, and external dependencies.

**Example:**
```csharp
services.AddHealthChecks()
    .AddSqlServer(Configuration["ConnectionStrings:DefaultConnection"]);
```

**Reference:**
- [Microsoft Docs: Health checks in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks)
