#!/usr/bin/env node
import { logger, tryCatchAsync } from '@paykit-sdk/core';
import { CheckoutInfo } from '@paykit-sdk/local/browser';
import { __defaultPaykitConfig, writePaykitConfig } from '@paykit-sdk/local/cli';
import { spawn } from 'child_process';
import { Command } from 'commander';
import { existsSync, unlinkSync } from 'fs';
import inquirer from 'inquirer';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program.name('@paykit-sdk/cli').description('PayKit CLI for product setup and development').version('1.1.0-alpha.4');

program
  .command('init')
  .description('Initialize your product info for PayKit')
  .action(async () => {
    logger.brand();
    logger.info("Welcome to PayKit! Let's set up your product.");
    logger.spacer();

    const answers = await inquirer.prompt<CheckoutInfo>([
      {
        type: 'input',
        name: 'name',
        message: 'Product name:',
        validate: (input: string) => (input ? true : 'Product name is required'),
      },
      {
        type: 'input',
        name: 'description',
        message: 'Product description (optional):',
      },
      {
        type: 'input',
        name: 'price',
        message: 'Product price (e.g. $10):',
        validate: (input: string) => (input ? true : 'Product price is required'),
      },
      {
        type: 'input',
        name: 'customerName',
        message: 'Default customer name:',
        validate: (input: string) => (input ? true : 'Customer name is required'),
      },
      {
        type: 'input',
        name: 'customerEmail',
        message: 'Default customer email (optional):',
        validate: (input: string) => {
          if (!input) return true; // Optional field
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(input) ? true : 'Please enter a valid email address';
        },
      },
    ]);

    logger.progress('Validating product info');

    logger.clearProgress();

    const product = { itemId: `it_${nanoid(30)}`, name: answers.name, description: answers.description, price: answers.price };

    const customer = { id: `cus_${nanoid(30)}`, email: answers.customerEmail, name: answers.customerName, metadata: {} };

    const config = __defaultPaykitConfig({ product, customer });

    const [result, error] = await tryCatchAsync(writePaykitConfig(config));

    if (error || !result) {
      logger.error('Failed to initialize PayKit configuration');
      return;
    }

    logger.spacer();
    logger.success('PayKit configuration initialized successfully!');
    logger.tip('Run `npx @paykit-sdk/cli dev` to start the development server');
  });

program
  .command('dev')
  .description('Start the PayKit development server')
  .action(async () => {
    logger.brand();
    logger.info('Starting PayKit development server...');
    logger.spacer();

    // Path to the built dev-app directory (same directory as this compiled CLI file)
    const devAppPath = path.join(__dirname, 'dev-app');
    const nodeModulesPath = path.join(devAppPath, 'node_modules');

    // Check if dependencies are installed or if package.json has been updated
    const forceReinstall = !existsSync(nodeModulesPath);

    if (forceReinstall) {
      logger.progress('Installing development dependencies (first time setup)...');

      // Clean up any existing lockfiles and node_modules to avoid conflicts
      const lockfiles = [path.join(devAppPath, 'package-lock.json'), path.join(devAppPath, 'yarn.lock'), path.join(devAppPath, 'pnpm-lock.yaml')];

      for (const lockfile of lockfiles) {
        if (existsSync(lockfile)) {
          try {
            unlinkSync(lockfile);
            logger.info(`Removed existing lockfile: ${path.basename(lockfile)}`);
          } catch (error) {
            // Ignore errors if file doesn't exist or can't be deleted
          }
        }
      }

      // Install dependencies with --no-package-lock to avoid creating a new lockfile
      const installProcess = spawn('npm', ['install', '--no-package-lock'], {
        cwd: devAppPath,
        stdio: 'ignore', // Completely silence npm output to avoid interference
      });

      // Wait for installation to complete
      await new Promise((resolve, reject) => {
        installProcess.on('close', code => {
          if (code === 0) {
            logger.success('Dependencies installed successfully!');
            resolve(undefined);
          } else {
            logger.error('Failed to install dependencies');
            reject(new Error(`npm install failed with code ${code}`));
          }
        });

        installProcess.on('error', error => {
          logger.error('Failed to install dependencies');
          reject(error);
        });
      });
    }

    logger.progress('Starting PayKit development app...');

    // Start the Next.js production server
    const nextProcess = spawn('npm', ['start'], {
      cwd: devAppPath,
      stdio: 'pipe',
    });

    // Wait for the server to be ready
    let serverReady = false;
    let outputBuffer = '';

    nextProcess.stdout?.on('data', data => {
      const output = data.toString();
      outputBuffer += output;

      // Check if server is ready (Next.js typically shows "Ready" when server starts)
      if (output.includes('Ready') || output.includes('Local:') || output.includes('localhost:3001')) {
        if (!serverReady) {
          serverReady = true;
          logger.clearProgress();
          logger.success('PayKit dev server running on http://localhost:3001');
          logger.tip('Press Ctrl+C to stop the server');
        }
      }
    });

    nextProcess.stderr?.on('data', data => {
      const error = data.toString();
      console.error('Next.js error:', error);
    });

    // Handle process exit
    nextProcess.on('close', code => {
      if (code !== 0) {
        logger.error(`Next.js process exited with code ${code}`);
      }
    });

    // Handle process errors
    nextProcess.on('error', error => {
      logger.error(`Failed to start Next.js server: ${error.message}`);
    });

    // Set a timeout to show success message even if we don't detect the ready signal
    setTimeout(() => {
      if (!serverReady) {
        serverReady = true;
        logger.clearProgress();
        logger.success('PayKit dev server running on http://localhost:3001');
        logger.tip('Press Ctrl+C to stop the server');
      }
    }, 10000); // 10 second timeout

    // Handle process termination
    process.on('SIGINT', () => {
      logger.spacer();
      logger.warn('Stopping PayKit dev server...');
      nextProcess.kill();
      process.exit();
    });
  });

program.parse(process.argv);
