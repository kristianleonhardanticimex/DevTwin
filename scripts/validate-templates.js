// scripts/validate-templates.js
// Validates that all template files referenced in devtwin-config.json exist in config/templates/.
// Also warns about orphaned template files.

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/devtwin-config.json');
const templatesDir = path.join(__dirname, '../config/templates');

function getAllTemplateIds(config) {
  const ids = new Set();
  for (const cat of config.categories) {
    for (const sub of cat.subcategories) {
      if (sub.template) ids.add(sub.template);
      if (sub.features) {
        for (const feat of sub.features) {
          if (feat.template) ids.add(feat.template);
        }
      }
    }
    if (cat.template) ids.add(cat.template);
  }
  return ids;
}

function main() {
  if (!fs.existsSync(configPath)) {
    console.error('Config file not found:', configPath);
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const referenced = getAllTemplateIds(config);

  // Check for missing template files
  let missing = [];
  for (const id of referenced) {
    const file = path.join(templatesDir, id + '.md');
    if (!fs.existsSync(file)) {
      missing.push(id + '.md');
    }
  }

  // Check for orphaned template files
  const allFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.md'));
  const orphaned = allFiles.filter(f => !referenced.has(f.replace(/\.md$/, '')));

  if (missing.length === 0 && orphaned.length === 0) {
    console.log('All referenced templates exist and no orphaned templates found.');
    process.exit(0);
  }
  if (missing.length > 0) {
    console.error('Missing template files:');
    for (const m of missing) console.error('  -', m);
  }
  if (orphaned.length > 0) {
    console.warn('Orphaned template files (not referenced in config):');
    for (const o of orphaned) console.warn('  -', o);
  }
  process.exit(missing.length > 0 ? 1 : 0);
}

if (require.main === module) main();
