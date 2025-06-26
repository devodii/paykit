#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { detectPackageManager } from './utils';

const isDryRun = process.argv.includes('--dry-run');
const isHelp = process.argv.includes('--help') || process.argv.includes('-h');

if (isHelp) {
  console.log(`
 Paykit Setup CLI - Setup Stripe + Upstash KV integration

Usage:
  npx @paykit/setup         Run interactive setup
  npx @paykit/setup --dry-run  Preview file generation without writing

Options:
  --dry-run     Show what would be done without writing files
  --help, -h    Show help menu
`);
  process.exit(0);
}
async function main() {
  console.log(`🛠️  Welcome to the Paykit Setup CLI${isDryRun ? ' (dry run)' : ''}`);
  // Language check
  const { language } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Are you using TypeScript or JavaScript?',
      choices: ['TypeScript', 'JavaScript'],
    },
  ]);

  if (language === 'JavaScript') {
    console.log('🤨 Wrong answer. You should only use Typescript.');
    // Continue execution anyway
  }
  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Which payment provider do you want to integrate?',
      choices: ['Stripe'],
    },
  ]);

  const pkgPath = path.join(process.cwd(), 'package.json');
  let framework: string | null = null;

  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (deps['next']) framework = 'Next.js';
  }

  if (!framework) {
    const { selected } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: 'No framework detected. Please select one:',
        choices: ['Next.js'],
      },
    ]);
    framework = selected;
  }

  const { confirmFramework } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmFramework',
      message: `Detected framework: ${framework}. Is this correct?`,
    },
  ]);

  if (!confirmFramework) {
    console.log('❌ Exiting setup. Please rerun and choose the correct framework.');
    process.exit(1);
  }

  const { isLocal } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isLocal',
      message: 'Is this app running locally (http://localhost:3000)?',
    },
  ]);

  let domain = 'http://localhost:3000';
  if (!isLocal) {
    const { customDomain } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customDomain',
        message: 'Enter your production domain (e.g., https://myapp.com):',
        validate: input => input.startsWith('http') || 'Must be a valid URL',
      },
    ]);
    domain = customDomain;
  }

  if (!isDryRun) {
    console.log('📦 Installing dependencies: stripe, @vercel/kv...');
    const packageManager = detectPackageManager();
    execSync(`${packageManager} add stripe @vercel/kv`, { stdio: 'inherit' });
  } else {
    console.log('⚠️ Skipped dependency installation.');
  }

  const frameworkKey = normalizeFrameworkKey(framework!);
  const templateRoot = path.join(__dirname, '..', 'templates', frameworkKey);

  const checkoutTemplate = path.join(templateRoot, 'generate-stripe-checkout.ts');
  const checkoutTarget = path.join(process.cwd(), 'src', 'app', 'api', 'generate-stripe-checkout', 'route.ts');
  copyAndReplaceDomain(checkoutTemplate, checkoutTarget, domain);

  const libBase = path.join(process.cwd(), 'src', 'lib');
  const filesToCopy = [
    {
      from: path.join(templateRoot, 'try-catch.ts'),
      to: path.join(libBase, 'try-catch.ts'),
    },
    {
      from: path.join(templateRoot, 'client.ts'),
      to: path.join(libBase, 'stripe', 'client.ts'),
    },
    {
      from: path.join(templateRoot, 'syncStripeDataToKV.ts'),
      to: path.join(libBase, 'stripe', 'syncStripeDataToKV.ts'),
    },
  ];

  for (const { from, to } of filesToCopy) {
    copyFile(from, to);
  }

  const successRoute = path.join(templateRoot, 'success.ts');
  const cancelRoute = path.join(templateRoot, 'cancel.ts');
  const webhookRoute = path.join(templateRoot, 'stripe-webhook.ts');

  const successTarget = path.join(process.cwd(), 'src', 'app', 'api', 'stripe', 'success', 'route.ts');
  const cancelTarget = path.join(process.cwd(), 'src', 'app', 'api', 'stripe', 'cancel', 'route.ts');
  const webhookTarget = path.join(process.cwd(), 'src', 'app', 'api', 'stripe', 'route.ts');

  copyFile(successRoute, successTarget);
  copyFile(cancelRoute, cancelTarget);
  copyFile(webhookRoute, webhookTarget);

  updateEnvFile();

  console.log('✅ Stripe integration setup complete!');
}

function copyFile(from: string, to: string) {
  if (!fs.existsSync(from)) {
    console.error(`❌ Template not found: ${from}`);
    return;
  }

  const dir = path.dirname(to);
  if (!fs.existsSync(dir) && !isDryRun) fs.mkdirSync(dir, { recursive: true });

  const content = fs.readFileSync(from, 'utf-8');
  if (isDryRun) {
    console.log(`🧪 Would write to ${to}:

${content}
`);
  } else {
    fs.writeFileSync(to, content, 'utf-8');
    console.log(`✅ Created: ${path.relative(process.cwd(), to)}`);
  }
}

function copyAndReplaceDomain(from: string, to: string, domain: string) {
  if (!fs.existsSync(from)) {
    console.error(`❌ Template not found: ${from}`);
    return;
  }

  const dir = path.dirname(to);
  if (!fs.existsSync(dir) && !isDryRun) fs.mkdirSync(dir, { recursive: true });

  const content = fs.readFileSync(from, 'utf-8').replace(/{{DOMAIN}}/g, domain);
  if (isDryRun) {
    console.log(`🧪 Would write to ${to}:

${content}
`);
  } else {
    fs.writeFileSync(to, content, 'utf-8');
    console.log(`✅ Created with domain: ${path.relative(process.cwd(), to)}`);
  }
}

function updateEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  const required = [
    'STRIPE_SECRET_KEY=sk_test_...',
    'STRIPE_WEBHOOK_SECRET=whsec_...',
    'PRICE_ID=price_...',
    'KV_REST_API_URL=',
    'KV_REST_API_TOKEN=',
  ];

  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
  const missing = required.filter(line => !existing.includes(line.split('=')[0]));

  if (missing.length === 0) return;

  if (isDryRun) {
    console.log(`🧪 Would update .env with:
${missing.join('\n')}
`);
    return;
  }

  fs.appendFileSync(envPath, `\n# Added by Paykit CLI\n${missing.join('\n')}\n`);
  console.log('✅ .env.local updated with missing Stripe & KV variables.');
}

function normalizeFrameworkKey(input: string): string {
  return input.toLowerCase().replace(/[^a-z]/g, '');
}

main();
