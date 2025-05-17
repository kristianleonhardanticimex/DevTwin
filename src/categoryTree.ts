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
        body {
          font-family: var(--vscode-font-family);
          color: var(--vscode-foreground);
          background: var(--vscode-editor-background);
          margin: 0;
          box-sizing: border-box;
        }
        #container {
          max-width: 760px;
          margin: 0 auto;
          padding: 24px 24px 0 24px;
        }
        #header h1 {
          font-size: 1.6em;
          margin: 0 0 8px 0;
          font-weight: 600;
        }
        #header p {
          color: var(--vscode-descriptionForeground);
          margin: 0 0 24px 0;
          font-size: 1.05em;
        }
        .search-container {
          width: 100%;
          margin-bottom: 32px;
        }
        .search {
          width: 100%;
        }
        #content {
          width: 100%;
        }
        .category {
          margin-bottom: 32px;
        }
        .category-title {
          font-size: 1.18em;
          font-weight: 600;
          margin: 0;
        }
        .category-desc {
          color: var(--vscode-descriptionForeground);
          font-size: 1em;
          margin: 2px 0 16px 0;
        }
        .subcategory {
          margin-left: 32px;
          margin-bottom: 18px;
        }
        .subcategory-header {
          display: flex;
          align-items: center;
        }
        .subcategory-checkbox {
          margin-right: 0.6em;
        }
        .subcategory-title {
          font-weight: 500;
          font-size: 1.07em;
        }
        .subcategory-desc {
          color: var(--vscode-descriptionForeground);
          font-size: 0.98em;
          margin: 2px 0 12px 0;
        }
        .feature-group {
          margin-left: 26px;
          margin-bottom: 14px;
        }
        .feature-group-title {
          font-weight: 500;
          font-size: 1.04em;
        }
        .feature-group-desc {
          color: var(--vscode-descriptionForeground);
          font-size: 0.97em;
          margin: 2px 0 8px 0;
        }
        .feature-list {
          margin-left: 32px;
        }
        .feature {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .feature-checkbox {
          margin-right: 0.5em;
        }
        .feature-desc {
          color: var(--vscode-descriptionForeground);
          font-size: 0.97em;
          line-height: 1.6;
          word-break: break-word;
        }
        .feature-tag {
          display: inline-block;
          margin-right: 7px;
          vertical-align: middle;
          font-size: 0.85em;
          border-radius: 4px;
          padding: 2px 7px;
          color: #fff;
        }
        .vscode-button {
          margin: 32px 0 0 0;
          display: block;
          width: 100%;
          text-align: left;
        }
        </style>
        <div id='container'>
          <div id='header'>
            <h1>DevTwin Instruction Builder</h1>
            <p><b>DevTwin</b> helps you configure <b>GitHub Copilot</b> to mirror your preferred way of developing software. Define your <b>coding style</b>, <b>tools</b>, <b>architecture</b>, and <b>best practices</b> by selecting from structured categories, subcategories, and features. Use the search bar to quickly filter options and click <b>Apply Selection</b> to generate or update your <b>.github/copilot-instructions.md</b> file. With DevTwin, Copilot becomes a <b>digital twin</b> that writes code the way you do.</p>
          </div>
          <div class='search-container'>
            <vscode-text-field class='search' placeholder='Search categories, subcategories, feature groups, features...' onchange='filterItems()'></vscode-text-field>
          </div>
          <div id='recommend-banner' style='display:none'></div>
          <div id='content'>
        `;
        for (const cat of config.categories) {
          html += `<div class='category'>`;
          html += `<div class='category-title'>${cat.name}</div>`;
          if (cat.description) {
            html += `<div class='category-desc'>${cat.description}</div>`;
          }
          for (const sub of cat.subcategories) {
            html += `<div class='subcategory'>`;
            html += `<div class='subcategory-header' style='display: flex; align-items: flex-start;'>`;
            const isChecked = (sub.defaultSelected === true || (Array.isArray(sub.defaultFeatures) && sub.defaultFeatures.length > 0)) ? 'checked' : '';
            html += `<vscode-checkbox class='subcategory-checkbox' data-subcategory='${sub.id}' data-recommend='${encodeURIComponent(JSON.stringify(sub.recommendations || []))}' ${isChecked}></vscode-checkbox>`;
            html += `<div style='display: flex; flex-direction: column;'>`;
            html += `<span class='subcategory-title'>${sub.name}</span>`;
            if (sub.description) {
              html += `<div class='subcategory-desc'>${sub.description}</div>`;
            }
            html += `</div>`;
            html += `</div>`;
            if (sub.featureGroups && sub.featureGroups.length > 0) {
              for (const group of sub.featureGroups) {
                html += `<div class='feature-group'>`;
                html += `<div class='feature-group-title'>${group.name}</div>`;
                if (group.description) {
                  html += `<div class='feature-group-desc'>${group.description}</div>`;
                }
                if (group.features && group.features.length > 0) {
                  html += `<div class='feature-list'>`;
                  for (const feat of group.features) {
                    html += `<div class='feature'>`;
                    html += `<vscode-checkbox class='feature-checkbox' data-feature='${feat.id}' data-parent='${sub.id}' data-group='${group.id}' data-recommend='${encodeURIComponent(JSON.stringify(feat.recommendations || []))}'></vscode-checkbox>`;
                    let tagsHtml = '';
                    if (feat.tags && Array.isArray(feat.tags)) {
                      for (const tag of feat.tags) {
                        tagsHtml += `<span class='feature-tag' style='background:${tag.color};color:#fff;font-weight:bold;border-radius:4px;padding:2px 7px;font-size:0.85em;margin-right:7px;vertical-align:middle;' ${tag.url ? `onclick=\"window.open('${tag.url}','_blank')\"` : ''}>${tag.label}</span>`;
                      }
                    }
                    html += `<span class='feature-desc'>${tagsHtml}<b>${feat.name}</b>${feat.description ? ' - ' + feat.description : ''}</span>`;
                    html += `</div>`;
                  }
                  html += `</div>`;
                }
                html += `</div>`;
              }
            }
            html += `</div>`;
          }
          html += `</div>`;
        }
        html += `</div><vscode-button id='applySelection'>Apply Selection</vscode-button>`;
        html += `<script type='module'>
        const vscode = acquireVsCodeApi();
        const config = ${JSON.stringify(config)};
        // --- Feature/subcategory logic ---
        function setFeatureStates(subId, checked) {
            const sub = config.categories.flatMap(c => c.subcategories).find(s => s.id === subId);
            const defaultFeatures = (sub && sub.defaultFeatures) ? sub.defaultFeatures : [];
            Array.from(document.querySelectorAll('.feature-checkbox[data-parent="' + subId + '"]')).forEach(function(fEl) {
                fEl.disabled = !checked;
                if (checked) {
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
                    var anyGroupMatch = false;
                    sub.querySelectorAll('.feature-group').forEach(function(group) {
                        var groupText = group.textContent.toLowerCase();
                        var groupMatch = groupText.includes(q);
                        var anyFeatMatch = false;
                        group.querySelectorAll('.feature').forEach(function(feat) {
                            var featText = feat.textContent.toLowerCase();
                            var featMatch = featText.includes(q);
                            feat.style.display = (featMatch || groupMatch || subMatch || catMatch) ? '' : 'none';
                            if (featMatch) anyFeatMatch = true;
                        });
                        group.style.display = (groupMatch || subMatch || catMatch || anyFeatMatch) ? '' : 'none';
                        if (groupMatch || anyFeatMatch) anyGroupMatch = true;
                    });
                    sub.style.display = (subMatch || catMatch || anyGroupMatch) ? '' : 'none';
                    if (subMatch || anyGroupMatch) anySubMatch = true;
                });
                catPanel.style.display = (catMatch || anySubMatch) ? '' : 'none';
            });
        }
        document.querySelector('.search').addEventListener('input', filterItems);
        document.querySelectorAll('.subcategory-checkbox').forEach(function(el) {
            el.addEventListener('change', function() {
                var subId = this.getAttribute('data-subcategory');
                var checked = this.checked;
                setFeatureStates(subId, checked);
            });
        });
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
        filterItems();
        </script>`;
        this.panel.webview.html = html;
    }
}