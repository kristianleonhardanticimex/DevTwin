# DevTwin – Copilot Instruction Builder Extension for VSCode

## Purpose
DevTwin enables developers to build `.github/copilot-instructions.md` files by selecting categories, subcategories, and features that define how GitHub Copilot (or other AI assistants) should behave—creating an AI "dev twin" that mirrors their preferred coding style, tools, and practices.

## Main Capabilities

### Three-Level Structure
- **Category**
  - Organizational level only
  - No selection checkbox
  - Contains subcategories
- **Subcategory**
  - Can be selected (checkbox)
  - Enables associated features
  - Has a description and optional info icon
- **Feature**
  - Can only be selected if the parent subcategory is selected
  - Describes a specific tool, convention, or configuration

### Behavioral Logic
- **Selection & Dependency Logic**
  - Features are only selectable if their parent subcategory is selected.
  - Deselecting a subcategory automatically deselects all its features.
  - A subcategory can define default-selected features.
  - When a subcategory is selected, all its default features are automatically selected. Users can manually deselect any feature afterward.
  - Dependencies can exist between subcategories and features (recommendations only). If a selected item has a dependency, a non-blocking prompt is shown. Deselecting an item does not auto-deselect its dependencies.

- **User Interface Behavior**
  - Left Sidebar: List of categories (click to navigate)
  - Main Panel: Lists subcategories and features of the selected category, checkboxes, info icons, dependency prompts
  - Search bar: Filters subcategories and features in real-time, expands relevant categories
  - Apply Selection button: Validates selections, updates `.github/copilot-instructions.md`

### Configuration and Templates
- **Configuration JSON**
  - Loaded from a public GitHub repository
  - Contains id, name, description for category, subcategory, and feature
  - `defaultFeatures` in subcategory
  - `recommendations` with `{ id, reason }` in both subcategory and feature levels
  - Follows a consistent schema

- **Template Markdown Files**
  - Pulled from a public GitHub repository
  - Each feature/subcategory has an associated `.md` template file
  - Templates include comment headers indicating origin

### Markdown File Generation
- **Target Output File:** `.github/copilot-instructions.md`
- **Logic:**
  - On Apply Selection: DevTwin loads all selected subcategories and features
  - For each selected: Corresponding markdown template is pulled from GitHub
  - Templates are concatenated in order of Category > Subcategory > Feature
  - If `.github/copilot-instructions.md` exists, it is updated (overwritten) and a backup is created as `.github/copilot-instructions.bak.md`

### Synchronization
- A "Refresh Config" option reloads the config + templates from GitHub
- Offline mode falls back to local cache
