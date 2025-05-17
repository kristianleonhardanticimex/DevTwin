# DevTwin Copilot Instruction Builder – Content Expansion Plan

This document collects proposed new categories, subcategories, and features for the Copilot Instruction Builder. Items are grouped by language and cross-cutting concerns. Use this as a working list before implementation.

---

## Languages
- **C# / .NET**
  - Project Structure
    - Clean Architecture
    - Feature Folders
  - Dependency Injection
    - Use Built-in DI
    - Service Lifetimes
  - Configuration & Secrets
    - appsettings.json
    - User Secrets
    - Environment Variables
  - Logging & Monitoring
    - Serilog
    - Health Checks
    - Application Insights
  - Unit Testing
    - xUnit
    - NUnit
    - MSTest
  - ASP.NET Web API
  - Entity Framework Core
  - LINQ
  - Minimal APIs
  - MediatR
  - Background Services (IHostedService)
  - Nullable Reference Types
- **JavaScript / TypeScript**
  - ES Modules
  - Async/Await
  - Promises
  - Type Safety with TypeScript
  - JSDoc
  - Frontend Frameworks
    - React
      - Functional Components
      - Hooks
      - Context API
      - Component Composition
      - React Query
      - Zustand / Redux Toolkit
    - Angular
      - NgModules
      - Dependency Injection
      - RxJS Patterns
      - Angular CLI
    - Vue
      - Composition API
      - Vuex
      - Vue Router
  - UI Testing
    - Playwright
    - Testing Library (React, Angular)
    - Storybook
- **Python**
  - Type Hints
  - Virtual Environments
  - Poetry / pipenv
  - pytest
  - PEP8
  - Asyncio
- **Go (GoLang)**
  - Standard Project Layout
  - go.mod
  - Interfaces
  - Goroutines
  - Channels
  - Error Handling Patterns
- **Rust**
  - Cargo Project Layout
  - Ownership & Borrowing
  - Traits
  - Lifetimes
  - Crates.io Best Practices
  - Tokio for Async
- **Java**
  - Spring Boot
  - JPA
  - Lombok
  - Dependency Injection with Spring
  - Maven / Gradle
- **Kotlin**
  - Coroutines
  - Ktor
  - Jetpack Compose (Android)
  - Extension Functions

## Software Design & Architecture
- Object-Oriented Programming
  - SOLID Principles
  - Inheritance and Composition
  - Encapsulation
  - Polymorphism
  - Abstraction
- Functional Programming
  - Pure Functions
  - Immutability
  - Higher-Order Functions
  - Pattern Matching
  - Monads and Functors
- Design Patterns
  - Singleton
  - Factory
  - Strategy
  - Observer
  - Repository
  - Adapter
  - Command
  - Mediator
  - Decorator
  - State
  - Visitor
- Architecture Styles
  - Onion Architecture
  - Clean Architecture
  - Hexagonal Architecture
  - Microservices
  - Serverless
  - Monolith
  - Modular Monolith
- Architectural Best Practices
  - Separation of Concerns
  - Dependency Inversion
  - Layered Architecture
  - Domain-Driven Design (DDD)
  - CQRS
  - Event Sourcing

## Testing & Quality
- Unit Testing
  - xUnit / NUnit / MSTest
  - JUnit / TestNG
  - Jest / Mocha / Vitest
  - pytest
  - Go test
  - Rust test
- Integration Testing
  - TestContainers
  - Playwright
  - Selenium
  - Cypress
- Test Practices
  - Arrange-Act-Assert Pattern
  - Test Data Builders
  - Mocking / Faking / Stubbing

## DevOps & CI/CD
- GitHub Actions / MCP
  - Workflow File Layout
  - Reusable Workflows
  - Secrets and Environments
  - Caching
- Azure Pipelines
  - Multi-Stage Pipelines
  - Templates and Variables
  - Deployment Slots
  - YAML Pipelines
- Docker
  - Multi-Stage Builds
  - Docker Compose
  - Dockerfile Best Practices
- Kubernetes
  - Helm Charts
  - Manifests
  - Kustomize
  - Liveness/Readiness Probes

## Documentation & DX
- Documentation Practices
  - README.md Templates
  - ADR (Architecture Decision Records)
  - Diataxis Framework
  - Docstrings / JSDoc / XML Comments
- MCP Integrations
  - GitHub MCP
  - Playwright MCP
  - Backstage.io
  - mkdocs / Docusaurus

## Security
- OWASP Top 10
- Secure Code Practices
- Input Validation / Output Encoding
- Authentication (JWT, OAuth2)
- Authorization
- Rate Limiting
- Secrets Management

## Best Practices & Principles
- Boy Scout Rule
- Keep It Simple, Stupid (KISS)
- Don't Repeat Yourself (DRY)
- You Aren’t Gonna Need It (YAGNI)
- Fail Fast
- Twelve-Factor App
- Convention over Configuration

## Code Management
- Git Flow
- GitHub Flow
- Trunk-Based Development
- Semantic Versioning
- Conventional Commits
- Monorepo vs Polyrepo

## Tooling
- ESLint / TSLint
- Prettier
- StyleCop / FxCop
- SonarQube
- Dependabot
- Renovate

---

> Add, refine, or reorganize as needed before implementation. Align with existing config structure and templates.
