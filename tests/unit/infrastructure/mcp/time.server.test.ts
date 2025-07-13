import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TimeServer } from '../../../../src/infrastructure/mcp/time.server.js';
import type { IGetCurrentTimeUseCase } from '../../../../src/application/interfaces/get-current-time.usecase.interface.js';
import type { IGetISO8601TimeUseCase } from '../../../../src/application/interfaces/get-iso8601-time.usecase.interface.js';
import type { ITimeData } from '../../../../src/shared/types/time.types.js';
import type { Mock } from 'vitest';

// Type definitions for private method testing
interface ITimeServerPrivateMethods {
  handleListTools(): Promise<{ tools: { name: string }[] }>;
  handleCallTool(request: { name: string; arguments?: unknown }): Promise<{
    content: { type: string; text: string }[];
    isError?: boolean;
  }>;
  parseTimeArguments(args: unknown): { includeMilliseconds?: boolean; timezone?: string };
}

interface IServerInstance {
  connect: Mock;
  _requestHandlers: Map<string, CallToolHandler>;
}

type CallToolHandler = (request: { method: string; params: unknown }, extra: unknown) => Promise<unknown>;

describe('TimeServer', () => {
  let timeServer: TimeServer;
  let mockGetCurrentTimeUseCase: IGetCurrentTimeUseCase;
  let mockGetISO8601TimeUseCase: IGetISO8601TimeUseCase;
  let mockServerConnect: Mock;

  beforeEach(() => {
    mockGetCurrentTimeUseCase = {
      execute: vi.fn(),
    };
    mockGetISO8601TimeUseCase = {
      execute: vi.fn(),
    };

    // Mock console.error to avoid test output noise
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    timeServer = new TimeServer({
      getCurrentTimeUseCase: mockGetCurrentTimeUseCase,
      getISO8601TimeUseCase: mockGetISO8601TimeUseCase,
    });

    // Access private server property for testing
    const serverInstance = (timeServer as unknown as { server: IServerInstance }).server;
    mockServerConnect = vi.fn().mockResolvedValue(undefined);
    serverInstance.connect = mockServerConnect;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('handleListTools', () => {
    it('should return available tools', async () => {
      const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
      const handler = privateMethods.handleListTools.bind(timeServer);
      const result = await handler();

      expect(result.tools).toHaveLength(2);
      expect(result.tools[0].name).toBe('get_current_time');
      expect(result.tools[1].name).toBe('get_iso8601_time');
    });
  });

  describe('handleCallTool', () => {
    describe('get_current_time', () => {
      it('should handle successful get_current_time call', async () => {
        const mockTimeData: ITimeData = {
          iso8601: '2024-01-15T10:30:45.123Z',
          timestamp: 1705315845123,
          timezone: 'UTC',
        };
        vi.mocked(mockGetCurrentTimeUseCase.execute).mockResolvedValue({
          success: true,
          data: mockTimeData,
        });

        const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
        const handler = privateMethods.handleCallTool.bind(timeServer);
        const result = await handler({ name: 'get_current_time' });

        expect(result.content).toHaveLength(1);
        expect(result.content[0].type).toBe('text');
        expect(JSON.parse(result.content[0].text)).toEqual(mockTimeData);
        expect(result.isError).toBeUndefined();
      });

      it('should handle failed get_current_time call', async () => {
        vi.mocked(mockGetCurrentTimeUseCase.execute).mockResolvedValue({
          success: false,
          error: 'Test error',
        });

        const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
        const handler = privateMethods.handleCallTool.bind(timeServer);
        const result = await handler({ name: 'get_current_time' });

        expect(result.content).toHaveLength(1);
        expect(result.content[0].type).toBe('text');
        expect(result.content[0].text).toBe('Error: Test error');
        expect(result.isError).toBe(true);
      });

      it('should handle get_current_time call with no error message', async () => {
        vi.mocked(mockGetCurrentTimeUseCase.execute).mockResolvedValue({
          success: false,
          data: undefined,
        });

        const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
        const handler = privateMethods.handleCallTool.bind(timeServer);
        const result = await handler({ name: 'get_current_time' });

        expect(result.content).toHaveLength(1);
        expect(result.content[0].type).toBe('text');
        expect(result.content[0].text).toBe('Error: Failed to get current time');
        expect(result.isError).toBe(true);
      });

      it('should handle arguments for get_current_time', async () => {
        const mockTimeData: ITimeData = {
          iso8601: '2024-01-15T10:30:45Z',
          timestamp: 1705315845000,
          timezone: 'America/New_York',
        };
        vi.mocked(mockGetCurrentTimeUseCase.execute).mockResolvedValue({
          success: true,
          data: mockTimeData,
        });

        const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
        const handler = privateMethods.handleCallTool.bind(timeServer);
        await handler({
          name: 'get_current_time',
          arguments: {
            includeMilliseconds: false,
            timezone: 'America/New_York',
          },
        });

        expect(mockGetCurrentTimeUseCase.execute).toHaveBeenCalledWith({
          includeMilliseconds: false,
          timezone: 'America/New_York',
        });
      });
    });

    describe('get_iso8601_time', () => {
      it('should handle successful get_iso8601_time call', async () => {
        const mockISO8601 = '2024-01-15T10:30:45.123Z';
        vi.mocked(mockGetISO8601TimeUseCase.execute).mockResolvedValue({
          success: true,
          iso8601: mockISO8601,
        });

        const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
        const handler = privateMethods.handleCallTool.bind(timeServer);
        const result = await handler({ name: 'get_iso8601_time' });

        expect(result.content).toHaveLength(1);
        expect(result.content[0].type).toBe('text');
        expect(result.content[0].text).toBe(mockISO8601);
        expect(result.isError).toBeUndefined();
      });

      it('should handle failed get_iso8601_time call', async () => {
        vi.mocked(mockGetISO8601TimeUseCase.execute).mockResolvedValue({
          success: false,
          error: 'Format error',
        });

        const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
        const handler = privateMethods.handleCallTool.bind(timeServer);
        const result = await handler({ name: 'get_iso8601_time' });

        expect(result.content).toHaveLength(1);
        expect(result.content[0].type).toBe('text');
        expect(result.content[0].text).toBe('Error: Format error');
        expect(result.isError).toBe(true);
      });

      it('should handle get_iso8601_time call with no error message', async () => {
        vi.mocked(mockGetISO8601TimeUseCase.execute).mockResolvedValue({
          success: false,
          iso8601: undefined,
        });

        const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
        const handler = privateMethods.handleCallTool.bind(timeServer);
        const result = await handler({ name: 'get_iso8601_time' });

        expect(result.content).toHaveLength(1);
        expect(result.content[0].type).toBe('text');
        expect(result.content[0].text).toBe('Error: Failed to get ISO8601 time');
        expect(result.isError).toBe(true);
      });
    });

    it('should throw error for unknown tool', async () => {
      const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
      const handler = privateMethods.handleCallTool.bind(timeServer);
      
      await expect(handler({ name: 'unknown_tool' })).rejects.toThrow('Unknown tool: unknown_tool');
    });
  });

  describe('parseTimeArguments', () => {
    it('should parse valid arguments', () => {
      const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
      const parser = privateMethods.parseTimeArguments.bind(timeServer);
      const result = parser({
        includeMilliseconds: false,
        timezone: 'Asia/Tokyo',
        extraField: 'ignored',
      });

      expect(result).toEqual({
        includeMilliseconds: false,
        timezone: 'Asia/Tokyo',
      });
    });

    it('should handle invalid arguments', () => {
      const privateMethods = timeServer as unknown as ITimeServerPrivateMethods;
      const parser = privateMethods.parseTimeArguments.bind(timeServer);
      
      expect(parser(null)).toEqual({});
      expect(parser(undefined)).toEqual({});
      expect(parser('string')).toEqual({});
      expect(parser(123)).toEqual({});
      expect(parser({ includeMilliseconds: 'not-boolean' })).toEqual({});
      expect(parser({ timezone: 123 })).toEqual({});
    });
  });

  describe('start', () => {
    it('should start the server successfully', async () => {
      await timeServer.start();

      expect(mockServerConnect).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('MCP Time Server (mcp-wtit) started successfully');
    });
  });

  describe('request handlers', () => {
    it('should handle CallToolRequest through registered handler', async () => {
      const mockTimeData: ITimeData = {
        iso8601: '2024-01-15T10:30:45.123Z',
        timestamp: 1705315845123,
        timezone: 'UTC',
      };
      vi.mocked(mockGetCurrentTimeUseCase.execute).mockResolvedValue({
        success: true,
        data: mockTimeData,
      });

      // Get the registered handler
      const serverWithPrivate = timeServer as unknown as { server: IServerInstance };
      const serverInstance = serverWithPrivate.server;
      const handlers = serverInstance._requestHandlers;
      const callToolHandler = handlers.get('tools/call') as CallToolHandler;

      // Call the handler with a proper request object including method
      const result = await callToolHandler({
        method: 'tools/call',
        params: {
          name: 'get_current_time',
          arguments: { includeMilliseconds: true }
        }
      }, {}) as { content: { type: string; text: string }[] };

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(JSON.parse(result.content[0].text)).toEqual(mockTimeData);
    });
  });
});