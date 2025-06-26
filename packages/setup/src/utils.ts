import fs from 'fs';
import path from 'path';
import { PackageManager } from './types';

export const detectPackageManager = (): PackageManager => {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
};

export const copyFile = (from: string, to: string, isDryRun: boolean) => {
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
};
