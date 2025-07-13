import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import type {
  TextContent,
  CallToolResult,
  ListToolsResult,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import type { IGetCurrentTimeUseCase } from '../../application/interfaces/get-current-time.usecase.interface.js';
import type { IGetISO8601TimeUseCase } from '../../application/interfaces/get-iso8601-time.usecase.interface.js';

export interface ITimeServerDependencies {
  getCurrentTimeUseCase: IGetCurrentTimeUseCase;
  getISO8601TimeUseCase: IGetISO8601TimeUseCase;
}

export class TimeServer {
  private server: Server;
  private readonly serverInfo = {
    name: 'mcp-wtit',
    version: '1.0.0',
    description: 'MCP server that provides current time in ISO8601 format',
  };

  constructor(private readonly dependencies: ITimeServerDependencies) {
    this.server = new Server(this.serverInfo, {
      capabilities: {
        tools: {},
      },
    });

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, this.handleListTools.bind(this));
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      return this.handleCallTool(request.params);
    });
  }

  private async handleListTools(): Promise<ListToolsResult> {
    return {
      tools: [
        {
          name: 'get_current_time',
          description: 'Get the current time with detailed information including ISO8601 format, timestamp, and timezone',
          inputSchema: {
            type: 'object',
            properties: {
              includeMilliseconds: {
                type: 'boolean',
                description: 'Include milliseconds in the ISO8601 format (default: true)',
                default: true,
              },
              timezone: {
                type: 'string',
                description: 'Timezone for the time (default: UTC). Examples: "UTC", "America/New_York", "Asia/Tokyo"',
                default: 'UTC',
              },
            },
          },
        } as Tool,
        {
          name: 'get_iso8601_time',
          description: 'Get the current time in ISO8601 format only',
          inputSchema: {
            type: 'object',
            properties: {
              includeMilliseconds: {
                type: 'boolean',
                description: 'Include milliseconds in the ISO8601 format (default: true)',
                default: true,
              },
              timezone: {
                type: 'string',
                description: 'Timezone for the time (default: UTC). Examples: "UTC", "America/New_York", "Asia/Tokyo"',
                default: 'UTC',
              },
            },
          },
        } as Tool,
      ],
    };
  }

  private async handleCallTool(request: { name: string; arguments?: unknown }): Promise<CallToolResult> {
    const { name, arguments: args } = request;

    switch (name) {
      case 'get_current_time':
        return this.handleGetCurrentTime(args);
      case 'get_iso8601_time':
        return this.handleGetISO8601Time(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async handleGetCurrentTime(args: unknown): Promise<CallToolResult> {
    const input = this.parseTimeArguments(args);
    const result = await this.dependencies.getCurrentTimeUseCase.execute(input);

    if (!result.success || !result.data) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${result.error || 'Failed to get current time'}`,
          } as TextContent,
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.data, null, 2),
        } as TextContent,
      ],
    };
  }

  private async handleGetISO8601Time(args: unknown): Promise<CallToolResult> {
    const input = this.parseTimeArguments(args);
    const result = await this.dependencies.getISO8601TimeUseCase.execute(input);

    if (!result.success || !result.iso8601) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${result.error || 'Failed to get ISO8601 time'}`,
          } as TextContent,
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: result.iso8601,
        } as TextContent,
      ],
    };
  }

  private parseTimeArguments(args: unknown): { includeMilliseconds?: boolean; timezone?: string } {
    if (!args || typeof args !== 'object') {
      return {};
    }

    const { includeMilliseconds, timezone } = args as Record<string, unknown>;

    return {
      includeMilliseconds: typeof includeMilliseconds === 'boolean' ? includeMilliseconds : undefined,
      timezone: typeof timezone === 'string' ? timezone : undefined,
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Time Server (mcp-wtit) started successfully');
  }
}