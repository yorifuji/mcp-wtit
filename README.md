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

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-wtit.git
cd mcp-wtit

# Install dependencies
npm install

# Build the project
npm run build
```

## 🚦 Quick Start

### For MCP Clients (Claude Desktop, etc.)

Add to your MCP client configuration:

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

#### `get_iso8601_time`

Get the current time in ISO8601 format only.

**Parameters:**
- `includeMilliseconds` (boolean, optional): Include milliseconds in ISO8601 format (default: true)
- `timezone` (string, optional): Timezone for the time (default: "UTC")

**Response:**
```
"2024-01-15T10:30:45.123Z"
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