# Application Insights

- Integrate [Azure Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/asp-net-core) for distributed tracing and monitoring.
- Use the `Microsoft.ApplicationInsights.AspNetCore` NuGet package.
- Configure instrumentation key in `appsettings.json` or via environment variable.

**Example:**
```csharp
services.AddApplicationInsightsTelemetry(Configuration["ApplicationInsights:InstrumentationKey"]);
```

**Reference:**
- [Microsoft Docs: Application Insights for ASP.NET Core](https://learn.microsoft.com/en-us/azure/azure-monitor/app/asp-net-core)
