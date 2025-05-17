# Feature Folders

Group related files by feature rather than by type. For example:

```
/Features
  /Orders
    OrderController.cs
    OrderService.cs
    OrderRepository.cs
  /Users
    UserController.cs
    UserService.cs
    UserRepository.cs
```

**Benefits:**
- Improves maintainability and discoverability.
- Reduces merge conflicts.
- Encourages modular design.

**Tip:** Use feature folders in the API and Application layers for large projects.
