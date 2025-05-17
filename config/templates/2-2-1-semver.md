# Copilot Instructions: Semantic Versioning

- All projects must use [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH).
- The current version must be stored in a version file appropriate for the language:
  - Node.js: `package.json`
  - Python: `pyproject.toml`, `setup.cfg`, or `VERSION`
  - .NET: `.csproj` or `Directory.Build.props`
  - Java: `pom.xml`
  - Other: `VERSION` or similar
- The version must be automatically bumped for every release or significant change.
- Use Copilot to suggest version bumps, but always review for correctness.
