# DevTwin – Task Breakdown

## 1. Requirements & Planning
- Write requirements in `/docs/requirements.md` (done)
- Break down requirements into actionable tasks (this file)

## 2. Project Setup
- Scaffold VSCode extension project structure
- Set up build, lint, and debug configurations

## 3. Configuration Management
- Implement logic to load configuration JSON from a public GitHub repository
- Implement local cache and offline fallback
- Implement "Refresh Config" option

## 4. UI Development
- Sidebar: List categories (click to navigate)
- Main Panel: List subcategories and features with checkboxes
- Info icons for descriptions
- Dependency prompts (modal or inline banner)
- Search bar for real-time filtering and auto-expansion
- Apply Selection button with validation

## 5. Selection & Dependency Logic
- Only allow feature selection if parent subcategory is selected
- Deselecting subcategory auto-deselects features
- Default features auto-selected on subcategory selection
- Allow manual deselection of features
- Show non-blocking prompts for dependencies (recommendations)
- Deselecting does not auto-deselect dependencies

## 6. Template Management
- Load markdown templates for features/subcategories from GitHub
- Parse and concatenate templates in correct order
- Add comment headers to templates

## 7. Markdown File Generation
- Generate `.github/copilot-instructions.md` on Apply Selection
- Overwrite existing file and create `.bak.md` backup if needed

## 8. Testing & Validation
- Unit tests for config loading, selection logic, and markdown generation
- UI/UX testing for sidebar, main panel, search, and prompts

## 9. Documentation
- Update `/docs/requirements.md` as needed
- Write user guide for extension usage

## 10. Release & Distribution
- Package and publish extension to VSCode Marketplace
- Provide update and support instructions
