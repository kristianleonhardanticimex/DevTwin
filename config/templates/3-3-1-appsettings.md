# appsettings.json

- Store non-secret configuration in `appsettings.json`.
- Use hierarchical structure for clarity.
- Bind config to strongly-typed classes using `IOptions<T>`.

**Example:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "..."
  }
}
```

**Reference:**
- [Microsoft Docs: appsettings.json](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/)
