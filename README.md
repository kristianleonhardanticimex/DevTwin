# devtwin-copilot-instruction-builder README

This is the README for your extension "devtwin-copilot-instruction-builder". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Usage

### 1. Open the Instruction Builder
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the Command Palette.
- Type and select `DevTwin: Open Instruction Builder`.

![Open Command Palette](https://github.com/kristianleonhardanticimex/DevTwin/raw/main/images/open-command-palette.png)

### 2. Build Your Copilot Instructions
- Use the modern, theme-aware UI to:
  - **Browse categories** (e.g., Frontend, Backend)
  - **Select subcategories** (e.g., React)
  - **Choose features** (e.g., JSX Support, Use Vitest)
  - See descriptions and info icons for each option
  - Use the search bar to filter options in real time
  - Respond to non-blocking dependency prompts (banners)

![Instruction Builder UI](https://github.com/kristianleonhardanticimex/DevTwin/raw/main/images/instruction-builder-ui.png)

### 3. Apply Your Selection
- Click the `Apply Selection` button.
- The extension will generate or update `.github/copilot-instructions.md` in your workspace.
- If the file exists, a backup is created as `.bak.md`.
- Success and error messages are shown in VS Code, with an option to open the file directly.

![Apply Selection](https://github.com/kristianleonhardanticimex/DevTwin/raw/main/images/apply-selection.png)

### 4. Refresh Configuration
- To reload the latest config and templates from GitHub, run the `DevTwin: Refresh Config` command from the Command Palette.
- The extension will fall back to a local cache if offline.

### 5. Troubleshooting & Tips
- If you see missing options or templates, use `Refresh Config`.
- All selections and dependencies are validated before file generation.
- For advanced usage, see `/docs/requirements.md` and `/docs/tasks.md`.

---

## Known Issues
- Some advanced dependency logic may be improved in future releases.
- UI/UX polish and accessibility improvements are ongoing.

---

## Screenshots
- Place your own screenshots in the `images/` folder and update the image links above.

---

## Support
- For issues or feature requests, open an issue on the [GitHub repository](https://github.com/kristianleonhardanticimex/DevTwin).

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
