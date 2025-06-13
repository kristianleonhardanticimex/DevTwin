// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { setExtensionPath } from './configLoader';
import { DevTwinPanelProvider } from './categoryTree';

let devTwinPanelProvider: DevTwinPanelProvider | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	await setExtensionPath(context);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "devtwin-copilot-instruction-builder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposableHelloWorld = vscode.commands.registerCommand('devtwin-copilot-instruction-builder.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from DevTwin Copilot Instruction Builder!');
	});

	context.subscriptions.push(disposableHelloWorld);

	devTwinPanelProvider = new DevTwinPanelProvider(context);
	context.subscriptions.push(
		vscode.commands.registerCommand('devtwin.openPanel', async () => {
			const panelProvider = new DevTwinPanelProvider(context);
			await panelProvider.showPanel();
			const webviewPanel = panelProvider.getWebviewPanel();
			if (webviewPanel) {
				webviewPanel.webview.onDidReceiveMessage(async (message) => {
					const { loadConfig, handleApplySubcategory, handleRemoveSubcategory, handleApplyFeature, handleRemoveFeature } = require('./configLoader');
					const config = await loadConfig();
					if (message.command === 'applySelection') {
						const { handleApplySelection } = require('./configLoader');
						await handleApplySelection(message.data);
					} else if (message.command === 'applySubcategory') {
						const sub = (config.categories.flatMap((c: any) => c.subcategories).find((s: any) => s.id === message.id));
						await handleApplySubcategory(message.id, sub ? `DevTwin: Added ${sub.name} to copilot-instructions.md` : 'DevTwin: Subcategory applied.');
						await panelProvider.updateWebview();
					} else if (message.command === 'removeSubcategory') {
						const sub = (config.categories.flatMap((c: any) => c.subcategories).find((s: any) => s.id === message.id));
						await handleRemoveSubcategory(message.id, sub ? `DevTwin: Removed ${sub.name} from copilot-instructions.md` : 'DevTwin: Subcategory removed.');
						await panelProvider.updateWebview();
					} else if (message.command === 'applyFeature') {
						let featName = message.id;
						for (const c of config.categories) {
							for (const s of c.subcategories) {
								for (const g of s.featureGroups || []) {
									const f = (g.features || []).find((f: any) => f.id === message.id);
									if (f) { featName = f.name; break; }
								}
							}
						}
						await handleApplyFeature(message.id, message.parent, `DevTwin: Added ${featName} to copilot-instructions.md`);
						await panelProvider.updateWebview();
					} else if (message.command === 'removeFeature') {
						let featName = message.id;
						for (const c of config.categories) {
							for (const s of c.subcategories) {
								for (const g of s.featureGroups || []) {
									const f = (g.features || []).find((f: any) => f.id === message.id);
									if (f) { featName = f.name; break; }
								}
							}
						}
						await handleRemoveFeature(message.id, `DevTwin: Removed ${featName} from copilot-instructions.md`);
						await panelProvider.updateWebview();
					} else if (message.command === 'refreshWebview') {
						await panelProvider.updateWebview();
					}
				});
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
