// scripts/validate-templates.js
// Validates that all template files referenced in devtwin-config.json exist in config/templates/.
// Also warns about orphaned template files.

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/devtwin-config.json');
const templatesDir = path.join(__dirname, '../config/templates');

function collectFeatureIds(config) {
  const ids = new Set();
  for (const cat of config.categories) {
    for (const sub of cat.subcategories) {
      for (const group of sub.featureGroups) {
        for (const feat of group.features) {
          ids.add(feat.id);
        }
      }
    }
  }
  return ids;
}

function main() {
  if (!fs.existsSync(configPath)) {
    console.error('Config file not found:', configPath);
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const featureIds = collectFeatureIds(config);
  const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.md'));
  const missing = [];
  for (const id of featureIds) {
    if (!templateFiles.includes(id + '.md')) {
      missing.push(id + '.md');
    }
  }
  if (missing.length) {
    console.log('Missing templates:', missing);
  } else {
    console.log('All templates present.');
  }
  // List extra templates
  const extra = templateFiles.filter(f => !featureIds.has(f.replace(/\.md$/, '')));
  if (extra.length) {
    console.log('Extra templates:', extra);
  }
}

main();
