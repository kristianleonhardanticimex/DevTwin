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
        #content { margin: 0 8px 0 8px; }
        .section { border-bottom: 1px solid var(--vscode-settings-dropdownBorder); padding-bottom: 0.5em; margin-bottom: 0.5em; }
        .category { margin-top: 1.5em; font-weight: 600; color: var(--vscode-settings-headerForeground); }
        .subcategory { margin-left: 1.5em; margin-top: 0.5em; }
        .feature { margin-left: 3em; margin-top: 0.2em; }
        .info { cursor: help; color: var(--vscode-descriptionForeground); margin-left: 0.3em; }
        .vscode-button { margin: 1.5em 0 1em 0; }
        </style>
        <vscode-text-field class='search' placeholder='Search categories, subcategories, features...' onchange='filterItems()'></vscode-text-field>
        <div id='content'>
        `;
        for (const cat of config.categories) {
            html += `<div class='category section'><span>${cat.name}</span> <span class='info' title='${cat.description || ''}'>ℹ️</span>`;
            for (const sub of cat.subcategories) {
                html += `<div class='subcategory'><vscode-checkbox class='subcategory-checkbox' data-subcategory='${sub.id}'>${sub.name}</vscode-checkbox> <span class='info' title='${sub.description || ''}'>ℹ️</span>`;
                if (sub.features && sub.features.length > 0) {
                    for (const feat of sub.features) {
                        html += `<div class='feature'><vscode-checkbox class='feature-checkbox' data-feature='${feat.id}' data-parent='${sub.id}'>${feat.name}</vscode-checkbox> <span class='info' title='${feat.description || ''}'>ℹ️</span></div>`;
                    }
                }
                html += `</div>`;
            }
            html += `</div>`;
        }
        html += `</div><vscode-button id='applySelection'>Apply Selection</vscode-button>`;
        html += `<script type='module'>
        const vscode = acquireVsCodeApi();
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
        document.querySelector('.search').addEventListener('input', filterItems);
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
            vscode.postMessage({ command: 'applySelection', data: selected });
        });
        </script>`;
        this.panel.webview.html = html;
    }
}