# MCP-WTIT (What Time Is It?)

A Model Context Protocol (MCP) server that provides current time in ISO8601 format with timezone support.

## 🚀 Features

- ⏰ Get current time with detailed information (ISO8601, timestamp, timezone)
- 🌍 Support for all IANA timezones
- 🎯 Optional milliseconds precision
- 🏗️ Clean Architecture design
- 📦 ESModules with TypeScript 5.6+
- ✅ Comprehensive test coverage
- 🔧 Type-safe with strict TypeScript configuration

## 📋 Requirements

- Node.js 18.0.0 or higher
- npm or yarn

## 🛠️ Installation

### As a global package

```bash
# Install globally
npm install -g mcp-wtit

# Run the server
mcp-wtit
```

### As a dependency

```bash
# Install as a dependency
npm install mcp-wtit
```

### From source

```bash
# Clone the repository
git clone https://github.com/yorifuji/mcp-wtit.git
cd mcp-wtit

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start
```

## 🚦 Quick Start

### For MCP Clients (Claude Desktop, etc.)

Add to your MCP client configuration:

#### If installed globally:
```json
{
  "mcpServers": {
    "mcp-wtit": {
      "command": "mcp-wtit"
    }
  }
}
```

#### If installed locally:
```json
{
  "mcpServers": {
    "mcp-wtit": {
      "command": "node",
      "args": ["./node_modules/mcp-wtit/dist/index.js"]
    }
  }
}
```

#### From source:
```json
{
  "mcpServers": {
    "mcp-wtit": {
      "command": "node",
      "args": ["/path/to/mcp-wtit/dist/index.js"]
    }
  }
}
```

### Debug with MCP Inspector

MCP Inspector provides a web-based interface to test and debug your MCP server:

```bash
# Build the project first
npm run build

# Run with MCP Inspector
npm run inspect
```

This will:
1. Start the MCP Inspector on http://localhost:6274
2. Automatically open your browser
3. Connect to the MCP server with debug capabilities

In the Inspector, you can:
- View available tools and their schemas
- Test tool calls with different parameters
- Monitor request/response communication
- Debug server behavior in real-time

### For Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Type check
npm run typecheck
```

## 📚 API Documentation

### Tools

#### `get_current_time`

Get the current time with detailed information.

**Parameters:**
- `includeMilliseconds` (boolean, optional): Include milliseconds in ISO8601 format (default: true)
- `timezone` (string, optional): Timezone for the time (default: "UTC")

**Response:**
```json
{
  "iso8601": "2024-01-15T10:30:45.123Z",
  "timestamp": 1705315845123,
  "timezone": "UTC"
}
```

## 🏛️ Architecture

This project follows Clean Architecture principles:

```
src/
├── domain/          # Business logic (no dependencies)
├── application/     # Use cases
├── infrastructure/  # External interfaces (MCP)
├── shared/          # Shared types and utilities
└── di/              # Dependency injection
```

See [Architecture Documentation](docs/ARCHITECTURE.md) for details.

## 🧪 Testing

Tests are located in the `tests/` directory and use Vitest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the TypeScript project |
| `npm run dev` | Run in development mode |
| `npm start` | Run the built server |
| `npm run inspect` | Debug with MCP Inspector |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and fix issues |
| `npm run typecheck` | Run TypeScript type checking |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the [Model Context Protocol](https://modelcontextprotocol.io/)
- Inspired by Clean Architecture principles

## 📦 NPM Package

[![npm version](https://badge.fury.io/js/mcp-wtit.svg)](https://www.npmjs.com/package/mcp-wtit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/mcp-wtit.svg)](https://nodejs.org/)

Published on npm: [mcp-wtit](https://www.npmjs.com/package/mcp-wtit)