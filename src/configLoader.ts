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

// Helper to get template content from local config/templates folder
async function getTemplateContent(type: 'category' | 'subcategory' | 'feature', id: string): Promise<string> {
    const templatePath = path.join(__dirname, `../../config/templates/${id}.md`);
    if (fs.existsSync(templatePath)) {
        return fs.readFileSync(templatePath, 'utf-8');
    }
    return '';
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
        output += await getTemplateContent('category', catId);
        for (const sub of selectedSubcats.filter(s => s.category.id === catId)) {
            output += await getTemplateContent('subcategory', sub.id);
            for (const feat of selectedFeatures.filter(f => f.subcategory.id === sub.id)) {
                output += await getTemplateContent('feature', feat.id);
            }
        }
    }
    // Write to .github/copilot-instructions.md, backup if exists
    const githubDir = path.join(vscode.workspace.workspaceFolders?.[0].uri.fsPath || '', '.github');
    if (!fs.existsSync(githubDir)) { fs.mkdirSync(githubDir); }
    const outFile = path.join(githubDir, 'copilot-instructions.md');
    const bakFile = path.join(githubDir, 'copilot-instructions.bak.md');
    if (fs.existsSync(outFile)) { fs.copyFileSync(outFile, bakFile); }
    fs.writeFileSync(outFile, output, 'utf-8');
    vscode.window.showInformationMessage('.github/copilot-instructions.md generated!');
}
