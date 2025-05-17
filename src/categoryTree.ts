import * as vscode from 'vscode';
import { loadConfig } from './configLoader';

export class DevTwinPanelProvider {
    public static readonly viewType = 'devtwin.panel';
    private panel: vscode.WebviewPanel | undefined;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public async showPanel() {
        if (!this.panel) { 
            this.panel = vscode.window.createWebviewPanel(
                DevTwinPanelProvider.viewType,
                'DevTwin Instruction Builder',
                vscode.ViewColumn.One,
                { enableScripts: true }
            );
            this.panel.onDidDispose(() => { this.panel = undefined; });
            await this.updateWebview();
            this.panel.webview.onDidReceiveMessage(async (message) => {
                if (message.command === 'applySelection') {
                    // Direct import for TypeScript/Node
                    const { handleApplySelection } = require('./configLoader');
                    await handleApplySelection(message.data);
                }
            });
        } else {
            this.panel.reveal();
        }
    }

    public async updateWebview() {
        if (!this.panel) { return; }
        const config = await loadConfig();
        let html = `
        <link rel="stylesheet" href="https://unpkg.com/@vscode/webview-ui-toolkit@1.0.0/dist/toolkit.min.css">
        <script type="module" src="https://unpkg.com/@vscode/webview-ui-toolkit@1.0.0/dist/toolkit.min.js"></script>
        <style>
        body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); margin: 16px; box-sizing: border-box; }
        #header { margin-bottom: 8px; max-width: 700px; margin-left: auto; margin-right: auto; }
        #header h1 { font-size: 1.6em; margin: 0 0 4px 0; font-weight: 600; }
        #header p { color: var(--vscode-descriptionForeground); margin: 0 0 18px 0; font-size: 1.05em; }
        .search-container { width: 100%; max-width: 700px; margin: 0 auto 18px auto; position: relative; display: flex; }
        .search { flex: 1 1 auto; width: 100%; min-width: 0; }
        .clear-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.3em;
          color: var(--vscode-descriptionForeground);
          background: none;
          border: none;
          cursor: pointer;
          z-index: 2;
          padding: 0 4px;
          line-height: 1;
        }
        #content { margin: 0 auto; max-width: 700px; }
        .category-panel {
          background: linear-gradient(135deg, var(--vscode-editorWidget-background, #23272e) 90%, var(--vscode-editor-background, #1e2024) 100%);
          border-radius: 8px;
          padding: 18px 18px 0 18px;
          margin-bottom: 24px;
          box-shadow: 0 1px 4px 0 rgba(0,0,0,0.07);
          width: 100%;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        .category-header { display: none; }
        .category-title { font-size: 1.15em; font-weight: 600; flex: 1; }
        .category-toggle { font-size: 1.2em; margin-right: 10px; transition: transform 0.2s; }
        .category-toggle.collapsed { transform: rotate(-90deg); }
        .category-desc { color: var(--vscode-descriptionForeground); font-size: 1em; margin-bottom: 12px; margin-left: 44px; }
        .category-content { padding: 0 18px 12px 18px; margin-bottom: 0; }
        .category-content.collapsed { display: none; }
        .subcategory { margin-left: 0.5em; margin-bottom: 10px; }
        .subcategory-title { font-weight: 500; }
        .subcategory-desc { color: var(--vscode-descriptionForeground); font-size: 0.98em; margin-bottom: 6px; margin-left: 1.5em; }
        .feature { margin-left: 2em; margin-bottom: 6px; display: flex; align-items: center; }
        .feature-desc { color: var(--vscode-descriptionForeground); font-size: 0.97em; margin-left: 0.5em; }
        .vscode-button { margin: 32px 0 0 0; }
        .recommend-banner { background: var(--vscode-editorInfo-background); color: var(--vscode-editorInfo-foreground); border-left: 3px solid var(--vscode-editorInfo-border); padding: 8px 12px; margin: 12px 0; border-radius: 4px; display: flex; align-items: center; gap: 1em; }
        </style>
        <div id='header'>
          <h1>DevTwin Instruction Builder</h1>
          <p>Build your <b>.github/copilot-instructions.md</b> by selecting categories, subcategories, and features that define how GitHub Copilot (or other AI assistants) should behave. Choose your preferred coding style, tools, and practices. Use the search bar to quickly filter options. Click <b>Apply Selection</b> to generate or update your instructions file.</p>
        </div>
        <div class='search-container'>
          <vscode-text-field class='search' placeholder='Search categories, subcategories, features...' onchange='filterItems()'></vscode-text-field>
          <button class='clear-icon' title='Clear search' tabindex='0' aria-label='Clear search' style='display:none;'>&times;</button>
        </div>
        <div id='recommend-banner' style='display:none'></div>
        <div id='content'>
        `;
        for (const cat of config.categories) {
            html += `<div class='category-panel' data-category='${cat.id}'>`;
            html += `<div class='category-content' id='content-${cat.id}'>`;
            for (const sub of cat.subcategories) {
                html += `<div class='subcategory'>`;
                html += `<vscode-checkbox class='subcategory-checkbox subcategory-title' data-subcategory='${sub.id}' data-recommend='${encodeURIComponent(JSON.stringify(sub.recommendations || []))}'>${sub.name}</vscode-checkbox>`;
                if (sub.description) { html += `<div class='subcategory-desc'>${sub.description}</div>`; }
                if (sub.features && sub.features.length > 0) {
                    for (const feat of sub.features) {
                        html += `<div class='feature'><vscode-checkbox class='feature-checkbox' data-feature='${feat.id}' data-parent='${sub.id}' data-recommend='${encodeURIComponent(JSON.stringify(feat.recommendations || []))}'></vscode-checkbox> <span class='feature-desc'><b>${feat.name}</b> - ${feat.description || ''}</span></div>`;
                    }
                }
                html += `</div>`;
            }
            html += `</div></div>`;
        }
        html += `</div><vscode-button id='applySelection'>Apply Selection</vscode-button>`;
        html += `<script type='module'>
        const vscode = acquireVsCodeApi();
        const config = ${JSON.stringify(config)};
        // --- Feature/subcategory logic ---
        function setFeatureStates(subId, checked) {
            // Find subcategory config
            const sub = config.categories.flatMap(c => c.subcategories).find(s => s.id === subId);
            const defaultFeatures = (sub && sub.defaultFeatures) ? sub.defaultFeatures : [];
            Array.from(document.querySelectorAll('.feature-checkbox[data-parent="' + subId + '"]')).forEach(function(fEl) {
                fEl.disabled = !checked;
                if (checked) {
                    // Only check if in defaultFeatures
                    fEl.checked = defaultFeatures.includes(fEl.getAttribute('data-feature'));
                } else {
                    fEl.checked = false;
                }
            });
        }
        // --- End feature/subcategory logic ---
        function filterItems() {
            var q = document.querySelector('.search').value.toLowerCase();
            document.querySelectorAll('.category-panel').forEach(function(catPanel) {
                var catText = catPanel.textContent.toLowerCase();
                var catMatch = catText.includes(q);
                var anySubMatch = false;
                catPanel.querySelectorAll('.subcategory').forEach(function(sub) {
                    var subText = sub.textContent.toLowerCase();
                    var subMatch = subText.includes(q);
                    var anyFeatMatch = false;
                    sub.querySelectorAll('.feature').forEach(function(feat) {
                        var featText = feat.textContent.toLowerCase();
                        var featMatch = featText.includes(q);
                        feat.style.display = (featMatch || subMatch || catMatch) ? '' : 'none';
                        if (featMatch) anyFeatMatch = true;
                    });
                    sub.style.display = (subMatch || catMatch || anyFeatMatch) ? '' : 'none';
                    if (subMatch || anyFeatMatch) anySubMatch = true;
                });
                catPanel.style.display = (catMatch || anySubMatch) ? '' : 'none';
            });
            // Show/hide clear icon
            const clearBtn = document.querySelector('.clear-icon');
            if (q.length > 0) {
                clearBtn.style.display = '';
            } else {
                clearBtn.style.display = 'none';
            }
        }
        document.querySelector('.search').addEventListener('input', filterItems);
        // Clear icon logic
        document.querySelector('.clear-icon').addEventListener('click', function() {
            const search = document.querySelector('.search');
            search.value = '';
            filterItems();
            search.focus();
        });
        // Remove dependency prompt logic for subcategory selection
        document.querySelectorAll('.subcategory-checkbox').forEach(function(el) {
            el.addEventListener('change', function() {
                var subId = this.getAttribute('data-subcategory');
                var checked = this.checked;
                setFeatureStates(subId, checked);
            });
        });
        // On load, set initial feature states
        document.querySelectorAll('.subcategory-checkbox').forEach(function(el) {
            var subId = el.getAttribute('data-subcategory');
            setFeatureStates(subId, el.checked);
        });
        document.getElementById('applySelection').addEventListener('click', function() {
            var selected = { subcategories: [], features: [] };
            document.querySelectorAll('.subcategory-checkbox').forEach(function(subEl) {
                if (subEl.checked) selected.subcategories.push(subEl.getAttribute('data-subcategory'));
            });
            document.querySelectorAll('.feature-checkbox').forEach(function(featEl) {
                if (featEl.checked && !featEl.disabled) selected.features.push(featEl.getAttribute('data-feature'));
            });
            vscode.postMessage({ command: 'applySelection', data: selected });
        });
        // On load, ensure clear icon is correct
        filterItems();
        </script>`;
        this.panel.webview.html = html;
    }
}