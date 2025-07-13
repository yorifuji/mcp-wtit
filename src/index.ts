#!/usr/bin/env node
import { Container } from './di/container.js';

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('\nShutting down MCP Time Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\nShutting down MCP Time Server...');
  process.exit(0);
});

async function main(): Promise<void> {
  try {
    const container = Container.getInstance();
    const timeServer = container.timeServer;
    
    await timeServer.start();
  } catch (error) {
    console.error('Failed to start MCP Time Server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});