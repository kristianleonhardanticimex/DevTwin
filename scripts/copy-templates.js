// scripts/copy-templates.js
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) { fs.mkdirSync(dest, { recursive: true }); }
    for (const file of fs.readdirSync(src)) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

const workspaceRoot = process.cwd();
const srcConfig = path.join(workspaceRoot, 'config');
const destConfig = path.join(workspaceRoot, '.vscode-test', 'workspace', 'config');

if (fs.existsSync(srcConfig)) {
    copyDir(srcConfig, destConfig);
    console.log('Copied config/ (including templates) for test workspace.');
} else {
    console.warn('No config directory found to copy.');
}
