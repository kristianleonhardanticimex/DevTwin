# Serilog

- Use [Serilog](https://serilog.net/) for structured logging.
- Configure sinks for console, files, and Application Insights.
- Enrich logs with contextual information (e.g., request ID, user ID).

**Example:**
```csharp
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log.txt")
    .CreateLogger();
```

**Reference:**
- [Serilog Docs](https://serilog.net/)
- [Microsoft Docs: Logging in .NET](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging/)
