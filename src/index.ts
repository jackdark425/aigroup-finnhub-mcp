#!/usr/bin/env node

import { startServer } from './server.js';
import { getLogger } from './utils/logger.js';

const logger = getLogger('Main');

async function main(): Promise<void> {
  try {
    logger.info('MCP Finnhub Node.js Server Starting...');
    await startServer();
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
