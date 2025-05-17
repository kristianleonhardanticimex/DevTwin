# Dependency Injection

Use the built-in DI container (`Microsoft.Extensions.DependencyInjection`) for registering and resolving services, repositories, and configuration.

- Register services in `Program.cs` or `Startup.cs` using `AddSingleton`, `AddScoped`, or `AddTransient`.
- Prefer constructor injection for dependencies.
- Avoid service locator or static access patterns.

**Example:**
```csharp
services.AddScoped<IOrderService, OrderService>();
services.AddSingleton<ILogger, Logger>();
```

**Reference:**
- [Microsoft Docs: Dependency injection in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
