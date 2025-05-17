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
        body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: #f4f6fa; margin: 16px; box-sizing: border-box; }
        #header { margin-bottom: 8px; }
        #header h1 { font-size: 1.6em; margin: 0 0 4px 0; font-weight: 600; }
        #header p { color: var(--vscode-descriptionForeground); margin: 0 0 18px 0; font-size: 1.05em; }
        .search { width: 100%; max-width: 700px; margin-bottom: 18px; }
        #content { margin: 0 auto; max-width: 700px; }
        .category-panel { background: #fff; border-radius: 8px; padding: 0 0 0 0; margin-bottom: 24px; box-shadow: 0 1px 4px 0 rgba(0,0,0,0.07); overflow: hidden; }
        .category-header { display: flex; align-items: center; cursor: pointer; padding: 18px 18px 12px 18px; }
        .category-title { font-size: 1.15em; font-weight: 600; flex: 1; }
        .category-toggle { font-size: 1.2em; margin-right: 10px; transition: transform 0.2s; }
        .category-toggle.collapsed { transform: rotate(-90deg); }
        .category-desc { color: var(--vscode-descriptionForeground); font-size: 1em; margin-bottom: 12px; margin-left: 44px; }
        .category-content { padding: 0 18px 12px 18px; }
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
        <vscode-text-field class='search' placeholder='Search categories, subcategories, features...' onchange='filterItems()'></vscode-text-field>
        <div id='recommend-banner' style='display:none'></div>
        <div id='content'>
        `;
        for (const cat of config.categories) {
            html += `<div class='category-panel' data-category='${cat.id}'>`;
            html += `<div class='category-header' onclick='toggleCategory("${cat.id}")'>`;
            html += `<span class='category-toggle' id='toggle-${cat.id}'>▶</span>`;
            html += `<span class='category-title'>${cat.name}</span>`;
            html += `</div>`;
            if (cat.description) { html += `<div class='category-desc'>${cat.description}</div>`; }
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
        // --- Collapsible category logic ---
        function toggleCategory(catId) {
            const content = document.getElementById('content-' + catId);
            const toggle = document.getElementById('toggle-' + catId);
            if (content.classList.contains('collapsed')) {
                content.classList.remove('collapsed');
                toggle.classList.remove('collapsed');
            } else {
                content.classList.add('collapsed');
                toggle.classList.add('collapsed');
            }
        }
        // --- End collapsible logic ---
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
        }
        document.querySelector('.search').addEventListener('input', filterItems);
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
        document.querySelectorAll('.category-header').forEach(function(header) {
            header.addEventListener('click', function() {
                const panel = this.parentElement;
                const content = panel.querySelector('.category-content');
                const toggle = panel.querySelector('.category-toggle');
                const isCollapsed = content.classList.toggle('collapsed');
                toggle.classList.toggle('collapsed', isCollapsed);
            });
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
        </script>`;
        this.panel.webview.html = html;
    }
}