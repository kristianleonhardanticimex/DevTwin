// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { refreshConfig, setExtensionPath } from './configLoader';
import { DevTwinPanelProvider } from './categoryTree';

let devTwinPanelProvider: DevTwinPanelProvider | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "devtwin-copilot-instruction-builder" is now active!');

	setExtensionPath(context);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposableHelloWorld = vscode.commands.registerCommand('devtwin-copilot-instruction-builder.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from DevTwin Copilot Instruction Builder!');
	});

	context.subscriptions.push(disposableHelloWorld);

	let disposableRefreshConfig = vscode.commands.registerCommand('devtwin.refreshConfig', async () => {
		try {
			await refreshConfig();
		} catch (err) {
			// Error message already shown in refreshConfig
		}
	});

	context.subscriptions.push(disposableRefreshConfig);

	devTwinPanelProvider = new DevTwinPanelProvider(context);
	context.subscriptions.push(
		vscode.commands.registerCommand('devtwin.openPanel', async () => {
			if (devTwinPanelProvider) {
				await devTwinPanelProvider.showPanel();
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
