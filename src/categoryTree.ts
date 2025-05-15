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
        <style>
        body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); margin: 0; padding: 0; }
        .search { width: 100%; padding: 6px 8px; font-size: 1em; margin-bottom: 10px; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); border-radius: 4px; }
        .category { margin-top: 1.5em; font-weight: 600; color: var(--vscode-settings-headerForeground); }
        .subcategory { margin-left: 1.5em; margin-top: 0.5em; }
        .feature { margin-left: 3em; margin-top: 0.2em; }
        label { display: flex; align-items: center; gap: 0.5em; }
        input[type='checkbox'] { accent-color: var(--vscode-checkbox-background); }
        .info { cursor: help; color: var(--vscode-descriptionForeground); margin-left: 0.3em; }
        .section { border-bottom: 1px solid var(--vscode-settings-dropdownBorder); padding-bottom: 0.5em; margin-bottom: 0.5em; }
        button { margin: 1.5em 0 1em 0; padding: 0.5em 1.5em; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 4px; font-size: 1em; cursor: pointer; }
        button:hover { background: var(--vscode-button-hoverBackground); }
        </style>
        <input class='search' type='text' placeholder='Search categories, subcategories, features...' oninput='filterItems()'/>
        <div id='content'>
        `;
        for (const cat of config.categories) {
            html += `<div class='category section'><span>${cat.name}</span> <span class='info' title='${cat.description || ''}'>$(info)</span>`;
            for (const sub of cat.subcategories) {
                html += `<div class='subcategory'><label><input type='checkbox' class='subcategory-checkbox' data-subcategory='${sub.id}'/> <span>${sub.name}</span></label> <span class='info' title='${sub.description || ''}'>$(info)</span>`;
                if (sub.features && sub.features.length > 0) {
                    for (const feat of sub.features) {
                        html += `<div class='feature'><label><input type='checkbox' class='feature-checkbox' data-feature='${feat.id}' data-parent='${sub.id}'/> <span>${feat.name}</span></label> <span class='info' title='${feat.description || ''}'>$(info)</span></div>`;
                    }
                }
                html += `</div>`;
            }
            html += `</div>`;
        }
        html += `</div><button id='applySelection'>Apply Selection</button>`;
        html += `<script>
        // VS Code icon replacement
        document.querySelectorAll('.info').forEach(function(el) {
            el.innerHTML = '<span style="font-size:1em;">&#9432;</span>';
        });
        function filterItems() {
            var q = document.querySelector('.search').value.toLowerCase();
            document.querySelectorAll('.category').forEach(function(cat) {
                var catText = cat.textContent.toLowerCase();
                var catMatch = catText.includes(q);
                var anySubMatch = false;
                cat.querySelectorAll('.subcategory').forEach(function(sub) {
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
                cat.style.display = (catMatch || anySubMatch) ? '' : 'none';
            });
        }
        // Selection logic
        document.querySelectorAll('.subcategory-checkbox').forEach(function(subEl) {
            subEl.addEventListener('change', function() {
                var subId = this.getAttribute('data-subcategory');
                var checked = this.checked;
                document.querySelectorAll(".feature-checkbox[data-parent='" + subId + "']").forEach(function(fEl) {
                    fEl.disabled = !checked;
                    if (!checked) fEl.checked = false;
                });
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
            const vscodeApi = acquireVsCodeApi();
            vscodeApi.postMessage({ command: 'applySelection', data: selected });
        });
        </script>`;
        this.panel.webview.html = html;
    }
}