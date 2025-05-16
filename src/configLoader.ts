// Utility to load configuration JSON from a public GitHub repository and cache it locally
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

const CONFIG_URL = 'https://raw.githubusercontent.com/kristianleonhardanticimex/DevTwin/main/config/devtwin-config.json';
const CACHE_DIR = path.join(__dirname, '../../.devtwin-cache');
const CACHE_FILE = path.join(CACHE_DIR, 'devtwin-config.json');

export async function loadConfig(): Promise<any> {
    // Try to fetch from GitHub
    try {
        const res = await fetch(CONFIG_URL);
        if (!res.ok) {throw new Error('Network response was not ok');}
        const json = await res.json();
        await cacheConfig(json);
        return json;
    } catch (err) {
        // Fallback to local cache
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, 'utf-8');
            return JSON.parse(data);
        } else {
            vscode.window.showErrorMessage('Failed to load configuration from GitHub and no local cache found.');
            throw err;
        }
    }
}

export async function cacheConfig(json: any) {
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR);
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(json, null, 2), 'utf-8');
}

export async function refreshConfig(): Promise<any> {
    // Force reload from GitHub
    try {
        const res = await fetch(CONFIG_URL);
        if (!res.ok) {throw new Error('Network response was not ok');}
        const json = await res.json();
        await cacheConfig(json);
        vscode.window.showInformationMessage('DevTwin config refreshed from GitHub.');
        return json;
    } catch (err) {
        vscode.window.showErrorMessage('Failed to refresh configuration from GitHub.');
        throw err;
    }
}

// Helper to get template content from GitHub (cloud-first)
async function getTemplateContent(type: 'category' | 'subcategory' | 'feature', id: string): Promise<string> {
    const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/kristianleonhardanticimex/DevTwin/main/config/templates/';
    const url = `${GITHUB_RAW_BASE}${id}.md`;
    try {
        const res = await fetch(url);
        if (res.ok) {
            let content = await res.text();
            // Remove any START/END block comments and verbose headers
            content = content.replace(/<!-- START:[\s\S]*?-->/g, '')
                             .replace(/<!-- END:[\s\S]*?-->/g, '')
                             .replace(/<!--([\s\S]*?)-->/g, '')
                             .replace(/^\s+|\s+$/g, '');
            return content + '\n';
        }
    } catch (err) {
        console.warn('Failed to fetch template from GitHub:', url, err);
    }
    // Fallback to local if GitHub fetch fails
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
    const candidatePaths = [
        path.join(workspaceRoot, 'config', 'templates', `${id}.md`),
        path.join(process.cwd(), 'config', 'templates', `${id}.md`)
    ];
    for (const templatePath of candidatePaths) {
        if (fs.existsSync(templatePath)) {
            let content = fs.readFileSync(templatePath, 'utf-8');
            content = content.replace(/<!-- START:[\s\S]*?-->/g, '')
                             .replace(/<!-- END:[\s\S]*?-->/g, '')
                             .replace(/<!--([\s\S]*?)-->/g, '')
                             .replace(/^\s+|\s+$/g, '');
            return content + '\n';
        }
    }
    console.warn('Template not found in GitHub or any candidate path:', url, candidatePaths);
    return `<!-- Missing template: ${id} (${type}) -->\n`;
}

export async function handleApplySelection(selection: { subcategories: string[]; features: string[] }) {
    const config = await loadConfig();
    // Find selected categories, subcategories, and features
    const selectedSubcats = [];
    const selectedFeatures = [];
    let selectedCategoryIds = new Set<string>();
    for (const cat of config.categories) {
        for (const sub of cat.subcategories) {
            if (selection.subcategories.includes(sub.id)) {
                selectedSubcats.push({ ...sub, category: cat });
                selectedCategoryIds.add(cat.id);
                for (const feat of sub.features) {
                    if (selection.features.includes(feat.id)) {
                        selectedFeatures.push({ ...feat, subcategory: sub, category: cat });
                    }
                }
            }
        }
    }
    // Concatenate templates in order: Category > Subcategory > Feature
    let output = '';
    for (const catId of selectedCategoryIds) {
        const catContent = await getTemplateContent('category', catId);
        output += `<!-- START: ${catId} (Category) -->\n` + catContent + `\n<!-- END: ${catId} -->\n`;
        for (const sub of selectedSubcats.filter(s => s.category.id === catId)) {
            const subContent = await getTemplateContent('subcategory', sub.id);
            output += `<!-- START: ${sub.id} (Subcategory: ${sub.name}) -->\n` + subContent + `\n<!-- END: ${sub.id} -->\n`;
            for (const feat of selectedFeatures.filter(f => f.subcategory.id === sub.id)) {
                const featContent = await getTemplateContent('feature', feat.id);
                output += `<!-- START: ${feat.id} (Feature: ${feat.name}) -->\n` + featContent + `\n<!-- END: ${feat.id} -->\n`;
            }
        }
    }
    // Write to .github/copilot-instructions.md, backup if exists
    try {
        const githubDir = path.join(vscode.workspace.workspaceFolders?.[0].uri.fsPath || '', '.github');
        if (!fs.existsSync(githubDir)) { fs.mkdirSync(githubDir); }
        const outFile = path.join(githubDir, 'copilot-instructions.md');
        const bakFile = path.join(githubDir, 'copilot-instructions.bak.md');
        if (fs.existsSync(outFile)) { fs.copyFileSync(outFile, bakFile); }
        fs.writeFileSync(outFile, output, 'utf-8');
        vscode.window.showInformationMessage('.github/copilot-instructions.md generated!', 'Open File').then(selection => {
            if (selection === 'Open File') {
                vscode.window.showTextDocument(vscode.Uri.file(outFile));
            }
        });
    } catch (err: any) {
        vscode.window.showErrorMessage('Failed to generate .github/copilot-instructions.md: ' + (err && err.message ? err.message : String(err)));
    }
}

// Loads and parses the existing copilot-instructions.md file, returning a map of found blocks and warnings for missing hierarchy
export async function loadCopilotInstructions(): Promise<{ blocks: Record<string, string>, warnings: string[] }> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
    const filePath = path.join(workspaceRoot, '.github', 'copilot-instructions.md');
    const blocks: Record<string, string> = {};
    const warnings: string[] = [];
    if (!fs.existsSync(filePath)) {
        vscode.window.showWarningMessage('No .github/copilot-instructions.md file found.');
        return { blocks, warnings };
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    // Find all blocks by START/END comments
    const blockRegex = /<!-- START: ([^\s]+) \(([^)]+)\) -->([\s\S]*?)<!-- END: \1 -->/g;
    let match;
    while ((match = blockRegex.exec(content)) !== null) {
        const id = match[1];
        const type = match[2];
        const blockContent = match[3].trim();
        blocks[id] = blockContent;
    }
    // Now check for hierarchy: if a feature exists but its subcategory or category is missing, warn
    const config = await loadConfig();
    for (const cat of config.categories) {
        if (!blocks[cat.id]) {
            // Check if any subcategory or feature under this category exists
            const subBlocks = cat.subcategories.filter((sub: any) => blocks[sub.id] || (sub.features && sub.features.some((f: any) => blocks[f.id])));
            if (subBlocks.length > 0) {
                warnings.push(`Category block missing: ${cat.id} (${cat.name}) but subcategory/feature blocks exist.`);
            }
            for (const sub of cat.subcategories) {
                if (!blocks[sub.id]) {
                    // Check if any feature under this subcategory exists
                    const featBlocks = (sub.features || []).filter((f: any) => blocks[f.id]);
                    if (featBlocks.length > 0) {
                        warnings.push(`Subcategory block missing: ${sub.id} (${sub.name}) but feature blocks exist.`);
                    }
                }
            }
        }
    }
    return { blocks, warnings };
}
