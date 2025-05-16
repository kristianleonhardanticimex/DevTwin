import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';
import { loadConfig, handleApplySelection } from '../configLoader';
import * as fs from 'fs';
import * as path from 'path';

function copyDirSync(src: string, dest: string) {
	if (!fs.existsSync(dest)) { fs.mkdirSync(dest, { recursive: true }); }
	for (const file of fs.readdirSync(src)) {
		const srcPath = path.join(src, file);
		const destPath = path.join(dest, file);
		if (fs.statSync(srcPath).isDirectory()) {
			copyDirSync(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

suite('DevTwin Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('Config loads from local file', async () => {
		const config = await loadConfig();
		assert.ok(config.categories && config.categories.length > 0, 'Categories should be loaded');
	});

	test('Markdown generation creates file', async () => {
		// Ensure templates are present in the test workspace
		const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
		const srcTemplates = path.join(__dirname, '../../config/templates');
		const destTemplates = path.join(workspaceRoot, 'config', 'templates');
		if (fs.existsSync(srcTemplates)) {
			copyDirSync(srcTemplates, destTemplates);
		}

		const githubDir = path.join(workspaceRoot, '.github');
		if (!fs.existsSync(githubDir)) {
			fs.mkdirSync(githubDir);
		}
		const selection = { subcategories: ['react'], features: ['jsx_support', 'use_vitest'] };
		await handleApplySelection(selection);
		const outFile = path.join(githubDir, 'copilot-instructions.md');
		assert.ok(fs.existsSync(outFile), 'copilot-instructions.md should be created');
		const content = fs.readFileSync(outFile, 'utf-8');
		try {
			assert.ok(
				content.includes('Frontend category includes frameworks and tools') &&
				content.includes('React is a popular JavaScript library') &&
				content.includes('Enable JSX syntax support in your project') &&
				content.includes('Use Vitest to run fast unit tests'),
				'Content should include all selected template content (category, subcategory, features)'
			);
		} catch (e) {
			console.error('Generated content:', content);
			throw e;
		}
	});

	test('Default features are auto-selected when subcategory is selected', async () => {
		const config = await loadConfig();
		const reactSub = config.categories[0].subcategories.find((s: any) => s.id === 'react');
		assert.ok(reactSub, 'React subcategory should exist');
		assert.ok(reactSub.defaultFeatures.includes('jsx_support'), 'JSX Support should be default feature');
	});

	test('Backup file is created when instructions file exists', async () => {
		const githubDir = path.join(vscode.workspace.workspaceFolders?.[0].uri.fsPath || '', '.github');
		const outFile = path.join(githubDir, 'copilot-instructions.md');
		const bakFile = path.join(githubDir, 'copilot-instructions.bak.md');
		fs.writeFileSync(outFile, 'dummy content', 'utf-8');
		const selection = { subcategories: ['react'], features: ['jsx_support'] };
		await handleApplySelection(selection);
		assert.ok(fs.existsSync(bakFile), 'Backup file should be created if instructions file existed');
		const bakContent = fs.readFileSync(bakFile, 'utf-8');
		assert.strictEqual(bakContent, 'dummy content', 'Backup file should contain previous content');
	});

	test('Graceful error if template is missing', async () => {
		const selection = { subcategories: ['react'], features: ['jsx_support', 'nonexistent_feature'] };
		let errorCaught = false;
		try {
			await handleApplySelection(selection);
		} catch (e) {
			errorCaught = true;
		}
		assert.strictEqual(errorCaught, false, 'Should not throw error if a template is missing');
	});
});
