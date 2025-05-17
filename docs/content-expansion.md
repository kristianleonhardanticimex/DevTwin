# DevTwin Copilot Instruction Builder – Content Expansion Plan

This document collects proposed new categories, subcategories, and features for the Copilot Instruction Builder. All items are organized into four levels: Category, Subcategory, Feature Group, Feature. Cross-cutting or deeper relationships are expressed as dependencies in parentheses. Each item includes a short description.

---

## Software Design & Architecture
- Object-Oriented Programming
  - Principles
    - SOLID Principles: Follow SOLID for maintainable, extensible OOP code.
    - Inheritance and Composition: Use inheritance and composition for code reuse and flexibility.
    - Encapsulation: Hide internal state and require all interaction to be performed through methods.
    - Polymorphism: Use interfaces and base classes to enable flexible code.
    - Abstraction: Model complex systems with simplified interfaces.
- Functional Programming
  - Principles
    - Pure Functions: Functions with no side effects and consistent outputs.
    - Immutability: Prefer immutable data for safer, more predictable code.
    - Higher-Order Functions: Functions that take or return other functions.
    - Pattern Matching: Use pattern matching for expressive, concise code.
    - Monads and Functors: Advanced abstractions for managing effects and data.
- Design Patterns
  - Creational
    - Singleton: Ensure a class has only one instance.
    - Factory: Create objects without specifying the exact class.
  - Behavioral
    - Strategy: Select algorithm at runtime.
    - Observer: Notify multiple objects of state changes.
    - Command: Encapsulate requests as objects.
    - Mediator: Reduce coupling between components.
    - State: Allow an object to alter its behavior when its state changes.
    - Visitor: Separate algorithms from objects on which they operate.
  - Structural
    - Repository: Abstract data access logic.
    - Adapter: Allow incompatible interfaces to work together.
    - Decorator: Add responsibilities to objects dynamically.
- Architecture Styles
  - Patterns
    - Onion Architecture: Emphasize separation of concerns and dependency inversion.
    - Clean Architecture: Organize code into layers for maintainability and testability.
    - Hexagonal Architecture: Isolate core logic from external concerns.
    - Microservices: Build applications as a suite of small, independent services.
    - Serverless: Architect apps using managed cloud functions.
    - Monolith: Build as a single, unified codebase.
    - Modular Monolith: Modularize a monolith for maintainability.
- Architectural Best Practices
  - Principles
    - Separation of Concerns: Keep different concerns in separate modules.
    - Dependency Inversion: Depend on abstractions, not concretions.
    - Layered Architecture: Organize code into logical layers.
    - Domain-Driven Design (DDD): Model software based on domain logic.
    - CQRS: Separate read and write operations.
    - Event Sourcing: Persist state as a sequence of events.

## Programming Languages
- C# / .NET
  - Core
    - Dependency Injection (built-in): Use .NET's DI container for loose coupling.
    - Nullable Reference Types: Enable null-safety in C# code.
  - Web & APIs
    - ASP.NET Web API: Build RESTful APIs with ASP.NET Core.
    - Minimal APIs: Lightweight HTTP APIs in ASP.NET Core.
  - Data & ORM
    - Entity Framework Core: ORM for data access in .NET.
    - LINQ: Query collections and databases with LINQ.
  - Logging & Messaging
    - Serilog: Structured logging for .NET applications.
    - MediatR: In-process messaging and CQRS for .NET.
    - Background Services (IHostedService): Run background tasks in .NET apps.
- JavaScript / TypeScript
  - Language Features
    - ES Modules: Use ES module syntax for modular, maintainable code.
    - Async/Await: Write asynchronous code using async/await for clarity and error handling.
    - Promises: Use Promises for managing asynchronous operations.
    - Type Safety with TypeScript: Add static typing to JavaScript for safer, more robust code.
    - JSDoc: Document code with JSDoc comments for better tooling and maintainability.
  - Frameworks
    - React: Build user interfaces with React. (depends on: Language Features)
    - Angular: Develop applications using Angular. (depends on: Language Features)
    - Vue: Create reactive UIs with Vue. (depends on: Language Features)
- Python
  - Language Features
    - Type Hints: Add type annotations for better tooling and safety.
    - Virtual Environments: Isolate dependencies for each project.
    - Poetry / pipenv: Modern dependency and environment management.
    - Asyncio: Write asynchronous code in Python.
  - Testing
    - pytest: Python's most popular testing framework.
  - Style
    - PEP8: Follow Python's style guide for readable code.
- Go (GoLang)
  - Project Structure
    - Standard Project Layout: Organize Go projects for scalability.
    - go.mod: Manage dependencies and versions.
  - Language Features
    - Interfaces: Define contracts for types.
    - Goroutines: Lightweight concurrency in Go.
    - Channels: Communicate safely between goroutines.
    - Error Handling Patterns: Idiomatic error handling in Go.
- Rust
  - Project Structure
    - Cargo Project Layout: Standard structure for Rust projects.
  - Language Features
    - Ownership & Borrowing: Memory safety without GC.
    - Traits: Define shared behavior.
    - Lifetimes: Manage references and memory safety.
    - Crates.io Best Practices: Package and share Rust code.
    - Tokio for Async: Asynchronous programming in Rust.
- Java
  - Frameworks
    - Spring Boot: Rapidly build production-ready Java apps.
    - JPA: Java Persistence API for ORM.
    - Lombok: Reduce boilerplate with annotations.
    - Dependency Injection with Spring: Use Spring's DI for modularity.
  - Build Tools
    - Maven: Java build automation.
    - Gradle: Modern build automation for Java.
- Kotlin
  - Language Features
    - Coroutines: Asynchronous programming in Kotlin.
    - Extension Functions: Add new functions to existing types.
  - Frameworks
    - Ktor: Asynchronous web framework for Kotlin.
    - Jetpack Compose (Android): Modern UI toolkit for Android.

## Testing & Quality
- Unit Testing
  - .NET
    - xUnit: Microsoft's recommended unit testing framework for .NET.
    - NUnit: Popular alternative unit testing framework for .NET.
    - MSTest: Built-in unit testing framework for .NET.
  - Java
    - JUnit: Most popular Java unit testing framework.
    - TestNG: Powerful Java testing framework.
  - JavaScript
    - Jest: Delightful JavaScript testing framework.
    - Mocha: Flexible JavaScript test framework.
    - Vitest: Fast unit testing for Vite projects.
  - Python
    - pytest: Python's most popular testing framework.
  - Go
    - Go test: Built-in Go testing tool.
  - Rust
    - Rust test: Built-in Rust testing tool.
- Integration Testing
  - Tools
    - TestContainers: Run test dependencies in containers.
    - Playwright: End-to-end browser testing for modern web apps.
    - Selenium: Browser automation for testing web apps.
    - Cypress: Fast, easy, and reliable testing for anything that runs in a browser.
- Test Practices
  - Patterns
    - Arrange-Act-Assert Pattern: Structure tests for clarity.
    - Test Data Builders: Create complex test data easily.
    - Mocking / Faking / Stubbing: Replace dependencies for isolated tests.

## DevOps & CI/CD
- GitHub Actions / MCP
  - Workflow
    - Workflow File Layout: Organize workflows for clarity and reuse.
    - Reusable Workflows: Share workflow logic across projects.
    - Secrets and Environments: Securely manage secrets and environment variables.
    - Caching: Speed up builds with dependency caching.
- Azure Pipelines
  - Features
    - Multi-Stage Pipelines: Model complex workflows with multiple stages.
    - Templates and Variables: Reuse pipeline logic and manage configuration.
    - Deployment Slots: Deploy safely with slots.
    - YAML Pipelines: Define pipelines as code.
- Docker
  - Features
    - Multi-Stage Builds: Optimize Docker images with multi-stage builds.
    - Docker Compose: Define and run multi-container Docker apps.
    - Dockerfile Best Practices: Write efficient, secure Dockerfiles.
- Kubernetes
  - Features
    - Helm Charts: Package and deploy Kubernetes applications.
    - Manifests: Declarative configuration for Kubernetes resources.
    - Kustomize: Customize Kubernetes YAML configurations.
    - Liveness/Readiness Probes: Monitor app health in Kubernetes.

## Documentation & DX
- Documentation Practices
  - Templates
    - README.md Templates: Standardize project documentation.
    - ADR (Architecture Decision Records): Record architectural decisions.
  - Frameworks
    - Diataxis Framework: Organize documentation by purpose.
    - Docstrings / JSDoc / XML Comments: Document code for better tooling.
- MCP Integrations
  - Tools
    - GitHub MCP: Integrate with GitHub's Model Context Protocol.
    - Playwright MCP: Integrate Playwright with MCP.
    - Backstage.io: Developer portal for managing software.
    - mkdocs / Docusaurus: Static site generators for documentation.

## Frontend
- React
  - Component Patterns
    - Functional Components: Use function-based components for simplicity and performance.
    - Component Composition: Build complex UIs by composing smaller components.
  - State & Data
    - Hooks: Manage state and side effects in React components.
    - Context API: Share state across the component tree.
    - React Query: Data fetching and caching for React apps.
    - Zustand / Redux Toolkit: State management libraries for React.
- Angular
  - Structure
    - NgModules: Organize Angular apps into cohesive blocks of functionality.
    - Angular CLI: Command-line tooling for Angular projects.
  - Patterns
    - Dependency Injection: Use Angular's DI system for modularity and testability.
    - RxJS Patterns: Reactive programming with RxJS in Angular.
- Vue
  - Structure
    - Composition API: Modern API for organizing Vue component logic.
    - Vuex: State management for Vue applications.
    - Vue Router: Routing for single-page Vue apps.
- UI Testing
  - Tools
    - Playwright: End-to-end browser testing for any frontend.
    - Testing Library (React, Angular): User-centric component testing for React and Angular. (depends on: React, Angular)
    - Storybook: Develop and document UI components in isolation.

## Security
- Security Practices
  - OWASP Top 10: Address the most critical security risks to web applications.
  - Secure Code Practices: Write code that avoids common vulnerabilities.
- Techniques
  - Input Validation / Output Encoding: Prevent injection attacks.
  - Authentication (JWT, OAuth2): Securely authenticate users.
  - Authorization: Control access to resources.
  - Rate Limiting: Prevent abuse by limiting requests.
  - Secrets Management: Securely store and access secrets.

## Best Practices & Principles
- General
  - Boy Scout Rule: Always leave the codebase cleaner than you found it.
  - Keep It Simple, Stupid (KISS): Prefer simple solutions.
  - Don't Repeat Yourself (DRY): Avoid code duplication.
  - You Aren’t Gonna Need It (YAGNI): Only build what you need.
  - Fail Fast: Detect errors early.
  - Twelve-Factor App: Best practices for building SaaS apps.
  - Convention over Configuration: Prefer sensible defaults.

## Code Management
- Workflows
  - Git Flow: Branching model for managing features and releases.
  - GitHub Flow: Lightweight workflow for continuous delivery.
  - Trunk-Based Development: Keep a single branch for all development.
- Versioning
  - Semantic Versioning: Use MAJOR.MINOR.PATCH versioning for all projects.
  - Conventional Commits: Use a standard format for commit messages.
- Repositories
  - Monorepo vs Polyrepo: Choose the right repo strategy for your team.

## Tooling
- Linters
  - ESLint / TSLint: Lint JavaScript and TypeScript code.
  - Prettier: Code formatter for consistent style.
  - StyleCop / FxCop: Lint and analyze .NET code.
- Quality Tools
  - SonarQube: Continuous inspection of code quality.
  - Dependabot: Automated dependency updates.
  - Renovate: Automated dependency management and updates.

---

> All items are four levels deep. Dependencies are shown in parentheses and only reference subcategories or features. Add, refine, or reorganize as needed before implementation. Align with existing config structure and templates.
