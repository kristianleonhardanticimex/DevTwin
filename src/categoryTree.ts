import * as vscode from 'vscode';
import { loadConfig } from './configLoader';

export class CategoryTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly id: string,
        public readonly description?: string,
        public readonly subcategories?: any[]
    ) {
        super(label, collapsibleState);
        this.tooltip = description;
    }
}

export class CategoryTreeProvider implements vscode.TreeDataProvider<CategoryTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CategoryTreeItem | undefined | void> = new vscode.EventEmitter<CategoryTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<CategoryTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    private categories: any[] = [];

    constructor() {
        this.refresh();
    }

    async refresh(): Promise<void> {
        try {
            const config = await loadConfig();
            this.categories = config.categories || [];
            this._onDidChangeTreeData.fire();
        } catch (err) {
            this.categories = [];
        }
    }

    getTreeItem(element: CategoryTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CategoryTreeItem): Thenable<CategoryTreeItem[]> {
        if (!element) {
            // Top-level: categories
            return Promise.resolve(
                this.categories.map((cat: any) =>
                    new CategoryTreeItem(cat.name, vscode.TreeItemCollapsibleState.Collapsed, cat.id, cat.description, cat.subcategories)
                )
            );
        } else if (element.subcategories) {
            // Subcategories as children
            return Promise.resolve(
                element.subcategories.map((sub: any) =>
                    new CategoryTreeItem(sub.name, vscode.TreeItemCollapsibleState.None, sub.id, sub.description)
                )
            );
        }
        return Promise.resolve([]);
    }
}

export class SubcategoryPanelProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'devtwin.subcategoryPanel';
    private _view?: vscode.WebviewView;

    constructor(private readonly context: vscode.ExtensionContext) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true
        };
        this.updateWebview();
    }

    public async updateWebview(selectedCategoryId?: string) {
        if (!this._view) return;
        const config = await loadConfig();
        let html = `<h2>DevTwin Subcategories & Features</h2>`;
        let selectedCategory = config.categories.find((cat: any) => cat.id === selectedCategoryId) || config.categories[0];
        if (selectedCategory) {
            html += `<h3>${selectedCategory.name}</h3>`;
            for (const sub of selectedCategory.subcategories) {
                html += `<div style='margin-bottom: 1em;'>`;
                html += `<label><input type='checkbox' data-subcategory='${sub.id}' /> <b>${sub.name}</b></label>`;
                if (sub.description) {
                    html += ` <span title='${sub.description}' style='cursor:help;'>ℹ️</span>`;
                }
                if (sub.features && sub.features.length > 0) {
                    html += `<ul>`;
                    for (const feat of sub.features) {
                        html += `<li><label><input type='checkbox' data-feature='${feat.id}' data-parent='${sub.id}' /> ${feat.name}`;
                        if (feat.description) {
                            html += ` <span title='${feat.description}' style='cursor:help;'>ℹ️</span>`;
                        }
                        html += `</label></li>`;
                    }
                    html += `</ul>`;
                }
                html += `</div>`;
            }
        }
        html += `<button id='applySelection'>Apply Selection</button>`;
        this._view.webview.html = html;
    }
}