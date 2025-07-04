import * as vscode from 'vscode';
import { loadConfig } from './configLoader';

// Move configLoader require to the top for performance
const configLoader = require('./configLoader');

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
                try {
                    if (message.command === 'applySelection') {
                        await configLoader.handleApplySelection(message.data);
                    } else if (message.command === 'applySubcategory') {
                        this.logToWebview('applySubcategory: ' + message.id);
                        await configLoader.handleApplySubcategory(message.id);
                        await this.updateWebview();
                    } else if (message.command === 'removeSubcategory') {
                        this.logToWebview('removeSubcategory: ' + message.id);
                        await configLoader.handleRemoveSubcategory(message.id);
                        await this.updateWebview();
                    } else if (message.command === 'applyFeature') {
                        this.logToWebview('applyFeature: ' + message.id + ' parent: ' + message.parent);
                        await configLoader.handleApplyFeature(message.id, message.parent);
                    } else if (message.command === 'removeFeature') {
                        this.logToWebview('removeFeature: ' + message.id + ' parent: ' + message.parent);
                        await configLoader.handleRemoveFeature(message.id, message.parent);
                    } else if (message.command === 'refreshPanel') {
                        this.logToWebview('refreshPanel');
                        await this.updateWebview();
                    }
                } catch (err) {
                    this.sendErrorToWebview(err);
                }
            });
        } else {
            this.panel.reveal();
        }
    }

    public getWebviewPanel(): vscode.WebviewPanel | undefined {
        return this.panel;
    }

    public postMessageToWebview(message: any) {
        if (this.panel) {
            this.panel.webview.postMessage(message);
        }
    }

    public async updateWebview() {
        if (!this.panel) { return; }
        try {
            const config = await loadConfig();
            let html = `
            <link rel="stylesheet" href="https://unpkg.com/@vscode/webview-ui-toolkit@1.0.0/dist/toolkit.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
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
            .info-icon {
              margin-left: 8px;
              cursor: pointer;
              color: var(--vscode-descriptionForeground);
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
            // Get selection state from backend
            const { getSelectionState } = require('./configLoader');
            const selection = getSelectionState ? getSelectionState() : { subcategories: [], features: [] };
            for (const cat of config.categories) {
              html += `<div class='category'>`;
              html += `<div class='category-title'>${cat.name}</div>`;
              if (cat.description) {
                html += `<div class='category-desc'>${cat.description}</div>`;
              }
              for (const sub of cat.subcategories) {
                const subChecked = selection.subcategories && selection.subcategories.includes(sub.id);
                html += `<div class='subcategory'>`;
                html += `<div class='subcategory-header' style='display: flex; align-items: center;'>`;
                html += `<input type='checkbox' class='subcategory-checkbox' data-category='${sub.id}' ${subChecked ? 'checked' : ''}/>`;
                html += `<span class='subcategory-title'>${sub.name}</span>`;
                html += `</div>`;
                if (sub.description) {
                  html += `<div class='subcategory-desc'>${sub.description}</div>`;
                }
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
                        // Feature checkbox: enabled only if subcategory is checked
                        let featChecked = false;
                        let featDisabled = '';
                        if (!subChecked) {
                          featChecked = false;
                          featDisabled = 'disabled';
                        } else {
                          featChecked = selection.features && selection.features.includes(feat.id);
                          featDisabled = '';
                        }
                        html += `<div class='feature'>`;
                        html += `<input type='checkbox' class='feature-checkbox instruction-checkbox' data-instruction='${feat.id}' data-parent='${sub.id}' ${featChecked ? 'checked' : ''} ${featDisabled}/>`;
                        html += `<span class='feature-desc'><b>${feat.name}</b>${feat.description ? ' - ' + feat.description : ''}</span>`;
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
            html += `</div>`;
            html += `
    <div id='info-dialog' style='display:none;position:fixed;z-index:9999;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);align-items:center;justify-content:center;'>
      <div id='info-dialog-content' style='background:#222;color:#fff;max-width:600px;width:90vw;min-width:320px;min-height:120px;padding:32px 28px 18px 28px;border-radius:10px;box-shadow:0 8px 32px #000a;position:absolute;top:20vh;left:calc(50vw - 300px);resize:both;overflow:auto;cursor:move;'>
        <span id='info-dialog-close' style='position:absolute;top:12px;right:18px;font-size:1.5em;cursor:pointer;'><i class='fa fa-times'></i></span>
        <div id='info-dialog-meta'></div>
        <hr style='margin:18px 0 12px 0;border:0;border-top:1px solid #444;'>
        <pre id='info-dialog-template' style='background:#181818;color:#fff;padding:14px 12px;border-radius:6px;overflow-x:auto;max-height:320px;'></pre>
      </div>
    </div>
    `;
            html += `<script>
            (function() {
              var config = ${JSON.stringify(config)};
              function showInfoDialog(type, id) {
                var meta = {};
                var templateContent = '';
                if (type === 'subcategory') {
                  for (var i=0; i<config.categories.length; ++i) {
                    var cat = config.categories[i];
                    for (var j=0; j<cat.subcategories.length; ++j) {
                      var sub = cat.subcategories[j];
                      if (sub.id === id) {
                        meta = {
                          title: sub.name,
                          description: sub.longDescription || sub.description || '',
                          docLink: sub.docLink || '',
                          author: 'Kristian Leonhard'
                        };
                        templateContent = '';
                      }
                    }
                  }
                } else if (type === 'feature') {
                  for (var i=0; i<config.categories.length; ++i) {
                    var cat = config.categories[i];
                    for (var j=0; j<cat.subcategories.length; ++j) {
                      var sub = cat.subcategories[j];
                      if (!sub.featureGroups) continue;
                      for (var k=0; k<sub.featureGroups.length; ++k) {
                        var group = sub.featureGroups[k];
                        if (!group.features) continue;
                        for (var l=0; l<group.features.length; ++l) {
                          var feat = group.features[l];
                          if (feat.id === id) {
                            meta = {
                              title: feat.name,
                              description: feat.longDescription || feat.description || '',
                              docLink: feat.docLink || '',
                              author: feat.author || 'Kristian Leonhard'
                            };
                            templateContent = feat.templateContent || '';
                          }
                        }
                      }
                    }
                  }
                }
                var metaHtml = "<div style='font-size:1.2em;font-weight:bold;'>" + (meta.title || '') + "</div>";
                if (meta.description) metaHtml += "<div style='margin:8px 0 0 0;'>" + meta.description + "</div>";
                if (meta.docLink) metaHtml += "<div style='margin:8px 0 0 0;'><a href='" + meta.docLink + "' target='_blank' style='color:#4af;text-decoration:underline;'>Documentation</a></div>";
                if (meta.author) metaHtml += "<div style='margin:8px 0 0 0;font-size:0.98em;color:#aaa;'>Author: " + meta.author + "</div>";
                document.getElementById('info-dialog-meta').innerHTML = metaHtml;
                document.getElementById('info-dialog-template').textContent = templateContent;
                document.getElementById('info-dialog').style.display = 'flex';
                // Center dialog
                var dialog = document.getElementById('info-dialog-content');
                dialog.style.left = 'calc(50vw - ' + (dialog.offsetWidth/2) + 'px)';
                dialog.style.top = '20vh';
              }
              // Moveable dialog logic
              var drag = false, dragOffsetX = 0, dragOffsetY = 0;
              var dialog = null;
              document.addEventListener('mousedown', function(e) {
                if (e.target && e.target.id === 'info-dialog-content') {
                  drag = true;
                  dialog = e.target;
                  dragOffsetX = e.clientX - dialog.offsetLeft;
                  dragOffsetY = e.clientY - dialog.offsetTop;
                  dialog.style.cursor = 'grabbing';
                }
              });
              document.addEventListener('mousemove', function(e) {
                if (drag && dialog) {
                  dialog.style.left = (e.clientX - dragOffsetX) + 'px';
                  dialog.style.top = (e.clientY - dragOffsetY) + 'px';
                }
              });
              document.addEventListener('mouseup', function(e) {
                if (drag && dialog) {
                  drag = false;
                  dialog.style.cursor = 'move';
                  dialog = null;
                }
              });
              // End moveable logic
              var infoIcons = document.querySelectorAll('.info-icon');
              for (var i=0; i<infoIcons.length; ++i) {
                infoIcons[i].addEventListener('click', function(e) {
                  e.stopPropagation();
                  showInfoDialog(this.getAttribute('data-type'), this.getAttribute('data-id'));
                });
              }
              document.getElementById('info-dialog-close').onclick = function() {
                document.getElementById('info-dialog').style.display = 'none';
              };
              document.getElementById('info-dialog').onclick = function(e) {
                if (e.target === this) this.style.display = 'none';
              };
            })();
            </script>`;
            html += `<script>
            (function() {
              var vscode = acquireVsCodeApi();
              // Subcategory checkbox event
              Array.from(document.querySelectorAll('.subcategory-checkbox')).forEach(function(cb) {
                cb.addEventListener('change', function(e) {
                  var subId = this.getAttribute('data-category');
                  console.log('[DevTwin] Subcategory changed:', subId, 'checked:', this.checked);
                  vscode.postMessage({ command: this.checked ? 'applySubcategory' : 'removeSubcategory', id: subId });
                  setTimeout(function() { vscode.postMessage({ command: 'refreshPanel' }); }, 100);
                });
              });
              // Feature checkbox event
              Array.from(document.querySelectorAll('.feature-checkbox')).forEach(function(cb) {
                cb.addEventListener('change', function(e) {
                  var featId = this.getAttribute('data-instruction');
                  var parentSub = this.getAttribute('data-parent');
                  console.log('[DevTwin] Feature changed:', featId, 'parent:', parentSub, 'checked:', this.checked);
                  vscode.postMessage({ command: this.checked ? 'applyFeature' : 'removeFeature', id: featId, parent: parentSub });
                });
              });
              // Listen for errors from extension
              window.addEventListener('message', event => {
                if (event.data && event.data.type === 'devtwin-error') {
                  alert('DevTwin error: ' + event.data.message);
                }
                if (event.data && event.data.type === 'devtwin-log') {
                  console.log('[DevTwin]', event.data.message);
                }
              });
            })();
            </script>`;
            this.panel.webview.html = html;
        } catch (err: any) {
            const errorMsg = (err && err.message) ? err.message : String(err);
            const vscode = require('vscode');
            vscode.window.showErrorMessage('DevTwin: ' + errorMsg);
            this.panel.webview.html = `
                <div style="padding:32px;color:#f55;font-size:1.2em;">
                    <b>DevTwin Error:</b><br>${errorMsg}
                </div>
            `;
        }
    }

    public logToWebview(msg: string) {
        if (this.panel) {
            this.panel.webview.postMessage({ type: 'devtwin-log', message: msg });
        }
    }

    public sendErrorToWebview(err: any) {
        if (this.panel) {
            this.panel.webview.postMessage({ type: 'devtwin-error', message: (err && err.message) ? err.message : String(err) });
        }
    }
}