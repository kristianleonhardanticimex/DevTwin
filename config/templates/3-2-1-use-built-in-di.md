# Use Built-in DI

Register and inject dependencies using the built-in DI container:

- Use `IServiceCollection` to register services.
- Use constructor injection for all dependencies.
- Avoid static or global service access.

**Example:**
```csharp
public class MyController : ControllerBase {
    private readonly IMyService _service;
    public MyController(IMyService service) {
        _service = service;
    }
}
```

**Reference:**
- [Microsoft Docs: Dependency injection in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
