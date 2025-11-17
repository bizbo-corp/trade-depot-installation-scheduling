#!/usr/bin/env node

/**
 * Sync environment variables from .env.local to Vercel
 * Usage: node scripts/sync-env-to-vercel.js [environment]
 * Environment: production, preview, or development (default: production)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ENV_FILE = path.join(__dirname, '..', '.env.local');
const ENVIRONMENT = process.argv[2] || 'production';

const VALID_ENVIRONMENTS = ['production', 'preview', 'development'];

if (!VALID_ENVIRONMENTS.includes(ENVIRONMENT)) {
  console.error(`Error: Invalid environment "${ENVIRONMENT}"`);
  console.error(`Valid environments: ${VALID_ENVIRONMENTS.join(', ')}`);
  process.exit(1);
}

if (!fs.existsSync(ENV_FILE)) {
  console.error(`Error: ${ENV_FILE} not found`);
  process.exit(1);
}

// Check if Vercel CLI is installed
try {
  execSync('which vercel', { stdio: 'ignore' });
} catch {
  console.error('Error: Vercel CLI not found. Install it with: npm i -g vercel');
  process.exit(1);
}

console.log(`Syncing environment variables from .env.local to Vercel (${ENVIRONMENT} environment)\n`);

// Read and parse .env.local
const envContent = fs.readFileSync(ENV_FILE, 'utf8');
const lines = envContent.split('\n');

let addedCount = 0;
let skippedCount = 0;

for (const line of lines) {
  // Skip comments and empty lines
  if (line.trim().startsWith('#') || !line.trim()) {
    continue;
  }

  const match = line.match(/^([^=]+)=(.*)$/);
  if (!match) {
    continue;
  }

  const key = match[1].trim();
  let value = match[2];

  // Remove quotes if present
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  // Unescape newlines in private keys
  value = value.replace(/\\n/g, '\n');

  if (!key) {
    continue;
  }

  try {
    console.log(`Adding ${key}...`);
    
    // Use echo to pipe value to vercel env add
    // The command expects the value via stdin
    execSync(`echo "${value.replace(/"/g, '\\"')}" | vercel env add ${key} ${ENVIRONMENT}`, {
      stdio: 'inherit',
      shell: '/bin/bash'
    });
    
    addedCount++;
    console.log(`✓ Added ${key}\n`);
  } catch (error) {
    // If variable already exists, Vercel will return an error
    // This is expected and we can continue
    if (error.message.includes('already exists') || error.stdout?.includes('already exists')) {
      console.log(`⊘ ${key} already exists, skipping...\n`);
      skippedCount++;
    } else {
      console.error(`✗ Failed to add ${key}: ${error.message}\n`);
      skippedCount++;
    }
  }
}

console.log('\n' + '='.repeat(50));
console.log(`Sync complete!`);
console.log(`Added: ${addedCount}`);
console.log(`Skipped: ${skippedCount}`);
console.log(`\nVerify with: vercel env ls`);
