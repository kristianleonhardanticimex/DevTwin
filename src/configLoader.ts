// Utility to load configuration JSON from the extension's bundled assets and access templates locally
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function getWorkspaceRoot(): string {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    throw new Error('DevTwin: No workspace folder open.');
}

let devtwinOutputChannel: vscode.OutputChannel | undefined;
let extensionContext: vscode.ExtensionContext | undefined;

export function setExtensionPath(context: vscode.ExtensionContext) {
    extensionContext = context;
    if (!devtwinOutputChannel) {
        devtwinOutputChannel = vscode.window.createOutputChannel('DevTwin');
    }
}

// --- In-memory cache for config and templates ---
let cachedConfig: any = null;
let cachedTemplates: Record<string, string> = {};

export function clearDevTwinCache() {
    cachedConfig = null;
    cachedTemplates = {};
    if (devtwinOutputChannel) {
        devtwinOutputChannel.appendLine('[DevTwin] DevTwin cache cleared.');
    }
}

export async function loadConfig(): Promise<any> {
    if (cachedConfig) {
        if (devtwinOutputChannel) { devtwinOutputChannel.appendLine('[DevTwin] Returning cached config.'); }
        return cachedConfig;
    }
    if (!extensionContext) {
        throw new Error('DevTwin: Extension context not set.');
    }
    const configPath = path.join(extensionContext.extensionPath, 'config', 'devtwin-config.json');
    if (devtwinOutputChannel) {
        devtwinOutputChannel.appendLine('[DevTwin] Loading config from extension: ' + configPath);
    }
    if (fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath, 'utf-8');
        cachedConfig = JSON.parse(data);
        return cachedConfig;
    } else {
        vscode.window.showErrorMessage('DevTwin: config/devtwin-config.json not found in extension.');
        throw new Error('DevTwin: config/devtwin-config.json not found in extension.');
    }
}

export async function getTemplateContent(_type: 'category' | 'subcategory' | 'featureGroup' | 'feature', id: string): Promise<string> {
    if (cachedTemplates[id]) {
        return cachedTemplates[id];
    }
    if (!extensionContext) {
        throw new Error('DevTwin: Extension context not set.');
    }
    const templatePath = path.join(extensionContext.extensionPath, 'config', 'templates', `${id}.md`);
    if (fs.existsSync(templatePath)) {
        let content = fs.readFileSync(templatePath, 'utf-8');
        content = content.replace(/<!-- START:[\s\S]*?-->/g, '')
                         .replace(/<!-- END:[\s\S]*?-->/g, '')
                         .replace(/<!--([\s\S]*?)-->/g, '')
                         .replace(/^\s+|\s+$/g, '');
        cachedTemplates[id] = content + '\n';
        return cachedTemplates[id];
    }
    // If missing, return a clear warning block
    const missing = `\n<!-- MISSING TEMPLATE: ${id}.md -->\n`;
    cachedTemplates[id] = missing;
    return missing;
}

// --- Selection state persistence ---
let currentSelection: { subcategories: string[]; features: string[] } = { subcategories: [], features: [] };

export function getSelectionState() {
    return currentSelection;
}

// Patch handleApplySelection to update currentSelection
// Accept a toast message and show it as a VS Code notification
export async function handleApplySelection(selection: { subcategories: string[]; features: string[] }, toast?: string) {
    currentSelection = selection;
    const config = await loadConfig();
    // Find selected categories, subcategories, feature groups, and features
    const selectedSubcats = [];
    const selectedFeatureGroups = [];
    const selectedFeatures = [];
    let selectedCategoryIds = new Set<string>();
    for (const cat of config.categories) {
        for (const sub of cat.subcategories) {
            if (selection.subcategories.includes(sub.id)) {
                selectedSubcats.push({ ...sub, category: cat });
                selectedCategoryIds.add(cat.id);
                if (sub.featureGroups && sub.featureGroups.length > 0) {
                    for (const group of sub.featureGroups) {
                        // If any feature in this group is selected, include the group
                        const groupSelectedFeatures = (group.features || []).filter((feat: any) => selection.features.includes(feat.id));
                        if (groupSelectedFeatures.length > 0) {
                            selectedFeatureGroups.push({ ...group, subcategory: sub, category: cat });
                            for (const feat of groupSelectedFeatures) {
                                selectedFeatures.push({ ...feat, featureGroup: group, subcategory: sub, category: cat });
                            }
                        }
                    }
                }
            }
        }
    }
    // Concatenate templates in order: Category > Subcategory > Feature Group > Feature
    let output = '';
    for (const catId of selectedCategoryIds) {
        const cat = config.categories.find((c: any) => c.id === catId);
        const catContent = await getTemplateContent('category', catId);
        output += `<!-- START: ${catId} (Category) -->\n` + catContent + `\n<!-- END: ${catId} -->\n`;
        for (const sub of selectedSubcats.filter(s => s.category.id === catId)) {
            const subContent = await getTemplateContent('subcategory', sub.id);
            output += `<!-- START: ${sub.id} (Subcategory: ${sub.name}) -->\n` + subContent + `\n<!-- END: ${sub.id} -->\n`;
            for (const group of selectedFeatureGroups.filter(g => g.subcategory.id === sub.id)) {
                // Try to load a template for the feature group (optional, fallback to empty if not found)
                let groupContent = '';
                try { groupContent = await getTemplateContent('featureGroup', group.id); } catch { groupContent = ''; }
                output += `<!-- START: ${group.id} (Feature Group: ${group.name}) -->\n` + (groupContent || '') + `\n<!-- END: ${group.id} -->\n`;
                for (const feat of selectedFeatures.filter(f => f.featureGroup.id === group.id)) {
                    const featContent = await getTemplateContent('feature', feat.id);
                    output += `<!-- START: ${feat.id} (Feature: ${feat.name}) -->\n` + featContent + `\n<!-- END: ${feat.id} -->\n`;
                }
            }
        }
    }
    // Write to .github/copilot-instructions.md (no backup)
    try {
        const workspaceRoot = getWorkspaceRoot();
        const githubDir = path.join(workspaceRoot, '.github');
        if (!fs.existsSync(githubDir)) { fs.mkdirSync(githubDir); }
        const outFile = path.join(githubDir, 'copilot-instructions.md');
        fs.writeFileSync(outFile, output, 'utf-8');
        if (toast) {
            vscode.window.showInformationMessage(toast);
        }
    } catch (err: any) {
        vscode.window.showErrorMessage('DevTwin: Failed to write copilot-instructions.md: ' + (err && err.message ? err.message : String(err)));
    }
}

export async function handleRemoveSubcategory(subcategoryId: string, toast?: string) {
    // Remove subcategory and all its features from copilot-instructions.md
    // (For simplicity, just remove the subcategory block and all its feature blocks)
    const configLocal = await loadConfig();
    let subLocal, catLocal;
    for (const c of configLocal.categories) {
        for (const s of c.subcategories) {
            if (s.id === subcategoryId) { subLocal = s; catLocal = c; break; }
        }
    }
    if (!subLocal || !catLocal) { return; }
    // Remove subcategory block and all its features
    const workspaceRoot = getWorkspaceRoot();
    const githubDir = path.join(workspaceRoot, '.github');
    const outFile = path.join(githubDir, 'copilot-instructions.md');
    if (!fs.existsSync(outFile)) { return; }
    let content = fs.readFileSync(outFile, 'utf-8');
    // Remove subcategory block
    const subBlockRegex = new RegExp(`<!-- START: ${subLocal.id} [^>]+-->[\s\S]*?<!-- END: ${subLocal.id} -->\n?`, 'g');
    content = content.replace(subBlockRegex, '');
    // Remove all feature blocks under this subcategory
    if (subLocal.featureGroups) {
        for (const group of subLocal.featureGroups) {
            for (const feat of group.features || []) {
                const featBlockRegex = new RegExp(`<!-- START: ${feat.id} [^>]+-->[\s\S]*?<!-- END: ${feat.id} -->\n?`, 'g');
                content = content.replace(featBlockRegex, '');
            }
        }
    }
    fs.writeFileSync(outFile, content, 'utf-8');
    // Remove subcategory and all its features from selection
    currentSelection.subcategories = currentSelection.subcategories.filter(id => id !== subcategoryId);
    if (subLocal && subLocal.featureGroups) {
        for (const group of subLocal.featureGroups) {
            for (const feat of group.features || []) {
                currentSelection.features = currentSelection.features.filter(fid => fid !== feat.id);
            }
        }
    }
    if (toast) {
        vscode.window.showInformationMessage(toast);
    }
}

export async function handleApplyFeature(featureId: string, parentSubId: string, toast?: string) {
    // Add only the feature block for this feature
    const configLocal = await loadConfig();
    let featLocal, subLocal, catLocal, groupLocal;
    for (const c of configLocal.categories) {
        for (const s of c.subcategories) {
            for (const g of s.featureGroups || []) {
                for (const f of g.features || []) {
                    if (f.id === featureId) { featLocal = f; subLocal = s; catLocal = c; groupLocal = g; break; }
                }
            }
        }
    }
    if (!featLocal || !subLocal || !catLocal) { return; }
    // Compose a selection with just this feature
    if (!currentSelection.subcategories.includes(subLocal.id)) {
        currentSelection.subcategories.push(subLocal.id);
    }
    if (!currentSelection.features.includes(featLocal.id)) {
        currentSelection.features.push(featLocal.id);
    }
    await handleApplySelection({ subcategories: currentSelection.subcategories, features: currentSelection.features }, toast);
}

export async function handleRemoveFeature(featureId: string, toast?: string) {
    // Remove only the feature block for this feature
    const workspaceRoot = getWorkspaceRoot();
    const githubDir2 = path.join(workspaceRoot, '.github');
    const outFile2 = path.join(githubDir2, 'copilot-instructions.md');
    if (!fs.existsSync(outFile2)) { return; }
    let content = fs.readFileSync(outFile2, 'utf-8');
    const featBlockRegex = new RegExp(`<!-- START: ${featureId} [^>]+-->[\s\S]*?<!-- END: ${featureId} -->\n?`, 'g');
    content = content.replace(featBlockRegex, '');
    fs.writeFileSync(outFile2, content, 'utf-8');
    // Remove feature from selection
    currentSelection.features = currentSelection.features.filter(fid => fid !== featureId);
    if (toast) {
        vscode.window.showInformationMessage(toast);
    }
}

// Loads and parses the existing copilot-instructions.md file, returning a map of found blocks and warnings for missing hierarchy
export async function loadCopilotInstructions(): Promise<{ blocks: Record<string, string>, warnings: string[] }> {
    const workspaceRoot = getWorkspaceRoot();
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

export async function handleApplySubcategory(subcategoryId: string, toast?: string) {
    // Add the subcategory to the current selection if not present
    if (!currentSelection.subcategories.includes(subcategoryId)) {
        currentSelection.subcategories.push(subcategoryId);
    }
    // Remove all features under this subcategory that are not in the config (defensive)
    const config = await loadConfig();
    let sub = null;
    for (const c of config.categories) {
        for (const s of c.subcategories) {
            if (s.id === subcategoryId) {
                sub = s;
                break;
            }
        }
    }
    if (sub && sub.featureGroups) {
        for (const group of sub.featureGroups) {
            for (const feat of group.features || []) {
                // Do not auto-add features, just ensure the subcategory is present
            }
        }
    }
    await handleApplySelection({ subcategories: currentSelection.subcategories, features: currentSelection.features }, toast);
}
