# Service Lifetimes

Choose the correct service lifetime when registering dependencies:

- **Singleton**: One instance for the app lifetime (stateless, thread-safe).
- **Scoped**: One instance per request (web apps, per HTTP request).
- **Transient**: New instance every time (lightweight, stateless).

**Example:**
```csharp
services.AddSingleton<IMySingleton, MySingleton>();
services.AddScoped<IMyScoped, MyScoped>();
services.AddTransient<IMyTransient, MyTransient>();
```

**Tip:** Avoid using Singleton for services with state or dependencies on scoped services.
