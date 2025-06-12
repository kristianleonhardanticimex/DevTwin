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
export async function getTemplateContent(_type: 'category' | 'subcategory' | 'featureGroup' | 'feature', id: string): Promise<string> {
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

// --- Selection state persistence ---
let currentSelection: { subcategories: string[]; features: string[] } = { subcategories: [], features: [] };

export function getSelectionState() {
    return currentSelection;
}

// Patch handleApplySelection to update currentSelection
export async function handleApplySelection(selection: { subcategories: string[]; features: string[] }) {
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

// --- Immediate apply/remove for subcategory/feature ---
export async function handleApplySubcategory(subcategoryId: string) {
    // Find all features for this subcategory and apply all defaultFeatures
    const config = await loadConfig();
    let sub, cat;
    for (const c of config.categories) {
        for (const s of c.subcategories) {
            if (s.id === subcategoryId) { sub = s; cat = c; break; }
        }
    }
    if (!sub || !cat) { return; }
    // Gather all default features for this subcategory
    const defaultFeatures = sub.defaultFeatures || [];
    const selection = { subcategories: [sub.id], features: defaultFeatures };
    currentSelection = selection;
    await handleApplySelection(selection);
}

export async function handleRemoveSubcategory(subcategoryId: string) {
    // Remove subcategory and all its features from copilot-instructions.md
    // (For simplicity, just remove the subcategory block and all its feature blocks)
    const config = await loadConfig();
    let sub, cat;
    for (const c of config.categories) {
        for (const s of c.subcategories) {
            if (s.id === subcategoryId) { sub = s; cat = c; break; }
        }
    }
    if (!sub || !cat) { return; }
    // Remove subcategory block and all its features
    const githubDir = path.join(extensionPath, '.github');
    const outFile = path.join(githubDir, 'copilot-instructions.md');
    if (!fs.existsSync(outFile)) { return; }
    let content = fs.readFileSync(outFile, 'utf-8');
    // Remove subcategory block
    const subBlockRegex = new RegExp(`<!-- START: ${sub.id} [^>]+-->[\s\S]*?<!-- END: ${sub.id} -->\n?`, 'g');
    content = content.replace(subBlockRegex, '');
    // Remove all feature blocks under this subcategory
    if (sub.featureGroups) {
        for (const group of sub.featureGroups) {
            for (const feat of group.features || []) {
                const featBlockRegex = new RegExp(`<!-- START: ${feat.id} [^>]+-->[\s\S]*?<!-- END: ${feat.id} -->\n?`, 'g');
                content = content.replace(featBlockRegex, '');
            }
        }
    }
    // Remove subcategory and all its features from selection
    currentSelection.subcategories = currentSelection.subcategories.filter(id => id !== subcategoryId);
    // Remove all features under this subcategory
    if (sub && sub.featureGroups) {
        for (const group of sub.featureGroups) {
            for (const feat of group.features || []) {
                currentSelection.features = currentSelection.features.filter(fid => fid !== feat.id);
            }
        }
    }
    fs.writeFileSync(outFile, content, 'utf-8');
}

export async function handleApplyFeature(featureId: string, parentSubId: string) {
    // Add only the feature block for this feature
    const config = await loadConfig();
    let feat, sub, cat, group;
    for (const c of config.categories) {
        for (const s of c.subcategories) {
            for (const g of s.featureGroups || []) {
                for (const f of g.features || []) {
                    if (f.id === featureId) { feat = f; sub = s; cat = c; group = g; break; }
                }
            }
        }
    }
    if (!feat || !sub || !cat) { return; }
    // Compose a selection with just this feature
    const selection = { subcategories: [sub.id], features: [feat.id] };
    // Add feature to selection
    if (!currentSelection.subcategories.includes(parentSubId)) {
        currentSelection.subcategories.push(parentSubId);
    }
    if (!currentSelection.features.includes(featureId)) {
        currentSelection.features.push(featureId);
    }
    await handleApplySelection({ subcategories: currentSelection.subcategories, features: currentSelection.features });
}

export async function handleRemoveFeature(featureId: string) {
    // Remove only the feature block for this feature
    const githubDir = path.join(extensionPath, '.github');
    const outFile = path.join(githubDir, 'copilot-instructions.md');
    if (!fs.existsSync(outFile)) { return; }
    let content = fs.readFileSync(outFile, 'utf-8');
    const featBlockRegex = new RegExp(`<!-- START: ${featureId} [^>]+-->[\s\S]*?<!-- END: ${featureId} -->\n?`, 'g');
    content = content.replace(featBlockRegex, '');
    // Remove feature from selection
    currentSelection.features = currentSelection.features.filter(fid => fid !== featureId);
    fs.writeFileSync(outFile, content, 'utf-8');
}
