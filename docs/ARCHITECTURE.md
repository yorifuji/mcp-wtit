# Architecture

## Overview

This MCP server is designed based on Clean Architecture principles. By placing business logic at the center and minimizing external dependencies, we achieve a testable and maintainable codebase.

## Layer Structure

### 1. Domain Layer (`src/domain/`)

- **Responsibility**: Implementation of business logic and business rules
- **Dependencies**: None (completely independent)
- **Key Components**:
  - `interfaces/`: Domain service interface definitions
  - `services/`: Business logic implementation (TimeService)

### 2. Application Layer (`src/application/`)

- **Responsibility**: Use case implementation and application-specific business rules
- **Dependencies**: Domain layer only
- **Key Components**:
  - `interfaces/`: Use case interface definitions
  - `usecases/`: Use case implementations
    - GetCurrentTimeUseCase

### 3. Infrastructure Layer (`src/infrastructure/`)

- **Responsibility**: Integration with external systems (MCP SDK)
- **Dependencies**: Application layer, Domain layer
- **Key Components**:
  - `mcp/`: MCP server implementation

### 4. Shared Layer (`src/shared/`)

- **Responsibility**: Type definitions and utilities shared across all layers
- **Key Components**:
  - `types/`: Common type definitions
  - `errors/`: Custom error classes

### 5. Dependency Injection (`src/di/`)

- **Responsibility**: Object creation and dependency management
- **Key Components**:
  - `container.ts`: DI container using singleton pattern

## Data Flow

```
MCP Client
    ↓
TimeServer (Infrastructure)
    ↓
UseCase (Application)
    ↓
TimeService (Domain)
```

## Design Principles

### SOLID Principles

1. **Single Responsibility Principle**: Each class has a single responsibility
2. **Open-Closed Principle**: Open for extension, closed for modification
3. **Liskov Substitution Principle**: Abstraction through interfaces
4. **Interface Segregation Principle**: Minimal necessary interfaces
5. **Dependency Inversion Principle**: Higher layers don't depend on lower layers

### Testability

- Each layer can be tested independently
- Easy mock creation using interfaces
- Utilization of pure functions

## Technology Stack

- **Language**: TypeScript 5.6+
- **Module System**: ESModules
- **Testing**: Vitest
- **Linting**: ESLint 9
- **Build**: TypeScript Compiler
- **Runtime**: Node.js 18+