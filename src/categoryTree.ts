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