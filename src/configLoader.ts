// Utility to load configuration JSON from the extension's bundled assets and access templates locally
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let extensionPath: string = '';
export function setExtensionPath(context: vscode.ExtensionContext) {
    extensionPath = context.extensionPath;
}

export async function loadConfig(): Promise<any> {
    // Always load config from the extension's bundled assets
    const configPath = path.join(extensionPath, 'config', 'devtwin-config.json');
    if (fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(data);
    } else {
        vscode.window.showErrorMessage('Bundled config file not found: ' + configPath);
        throw new Error('Bundled config file not found');
    }
}

export async function cacheConfig(_json: any) {
    // No-op: caching not needed for bundled config
}

export async function refreshConfig(): Promise<any> {
    // No-op: always use bundled config
    vscode.window.showInformationMessage('DevTwin config reloaded from bundled assets.');
    return loadConfig();
}

// Helper to get template content from bundled assets only
export async function getTemplateContent(_type: 'category' | 'subcategory' | 'feature', id: string): Promise<string> {
    const templatePath = path.join(extensionPath, 'config', 'templates', `${id}.md`);
    if (fs.existsSync(templatePath)) {
        let content = fs.readFileSync(templatePath, 'utf-8');
        content = content.replace(/<!-- START:[\s\S]*?-->/g, '')
                         .replace(/<!-- END:[\s\S]*?-->/g, '')
                         .replace(/<!--([\s\S]*?)-->/g, '')
                         .replace(/^\s+|\s+$/g, '');
        return content + '\n';
    }
    // If missing, return a clear warning block
    return `\n<!-- MISSING TEMPLATE: ${id}.md -->\n`;
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
        const githubDir = path.join(extensionPath, '.github');
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
    const filePath = path.join(extensionPath, '.github', 'copilot-instructions.md');
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
