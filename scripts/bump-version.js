#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

try {
  // Run npm version patch
  console.log('Running npm version patch...');
  execSync('npm version patch', { cwd: rootDir, stdio: 'inherit' });

  // Read the new version from package.json
  const packageJsonPath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const newVersion = packageJson.version;

  console.log(`New version: ${newVersion}`);

  // Update customConsoleLog.ts
  const customLogPath = join(rootDir, 'src/core/utils/customConsoleLog.ts');
  let content = readFileSync(customLogPath, 'utf-8');

  // Replace the version in the template string
  content = content.replace(/v\d+\.\d+\.\d+/g, `v${newVersion}`);

  writeFileSync(customLogPath, content, 'utf-8');

  console.log(`Updated customConsoleLog.ts with version v${newVersion}`);
  console.log('Version bump complete!');
} catch (error) {
  console.error('Error during version bump:', error.message);
  process.exit(1);
}
