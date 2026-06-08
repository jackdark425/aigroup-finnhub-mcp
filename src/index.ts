#!/usr/bin/env node

import { createRequire } from 'node:module';
import { getLogger } from './utils/logger.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json') as { version: string };
const PACKAGE_VERSION = packageJson.version;
const logger = getLogger('Main');

function printHelp(): void {
  console.log(`aigroup-finnhub-mcp ${PACKAGE_VERSION}

Finnhub market data MCP server for stocks, crypto, forex, and market analysis.

Usage:
  aigroup-finnhub-mcp [options]

Options:
  -h, --help       Show this help message
  -v, --version    Show package version`);
}

function handleCliMetadataFlags(args: string[]): boolean {
  if (args.includes('--version') || args.includes('-v')) {
    console.log(PACKAGE_VERSION);
    return true;
  }

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return true;
  }

  return false;
}

async function main(): Promise<void> {
  try {
    if (handleCliMetadataFlags(process.argv.slice(2))) {
      return;
    }

    const { startServer } = await import('./server.js');
    logger.info('MCP Finnhub Node.js Server Starting...');
    await startServer();
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

void main();
