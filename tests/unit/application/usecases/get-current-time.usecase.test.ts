import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetCurrentTimeUseCase } from '../../../../src/application/usecases/get-current-time.usecase.js';
import type { ITimeService } from '../../../../src/domain/interfaces/time.service.interface.js';
import { TimeServiceError } from '../../../../src/shared/errors/time.errors.js';
import type { ITimeData } from '../../../../src/shared/types/time.types.js';

describe('GetCurrentTimeUseCase', () => {
  let useCase: GetCurrentTimeUseCase;
  let mockTimeService: ITimeService;

  beforeEach(() => {
    mockTimeService = {
      getCurrentTime: vi.fn(),
      getCurrentTimeISO8601: vi.fn(),
      getCurrentTimestamp: vi.fn(),
      getTimeZone: vi.fn(),
    };
    useCase = new GetCurrentTimeUseCase(mockTimeService);
  });

  describe('execute', () => {
    it('should return success with time data', async () => {
      const mockTimeData: ITimeData = {
        iso8601: '2024-01-15T10:30:45.123Z',
        timestamp: 1705315845123,
        timezone: 'UTC',
      };
      vi.mocked(mockTimeService.getCurrentTime).mockReturnValue(mockTimeData);

      const result = await useCase.execute();

      expect(result).toEqual({
        success: true,
        data: mockTimeData,
      });
      expect(mockTimeService.getCurrentTime).toHaveBeenCalledWith({});
    });

    it('should pass options to time service', async () => {
      const mockTimeData: ITimeData = {
        iso8601: '2024-01-15T10:30:45Z',
        timestamp: 1705315845000,
        timezone: 'America/New_York',
      };
      vi.mocked(mockTimeService.getCurrentTime).mockReturnValue(mockTimeData);

      const input = {
        includeMilliseconds: false,
        timezone: 'America/New_York',
      };
      const result = await useCase.execute(input);

      expect(result).toEqual({
        success: true,
        data: mockTimeData,
      });
      expect(mockTimeService.getCurrentTime).toHaveBeenCalledWith(input);
    });

    it('should handle TimeServiceError', async () => {
      const error = new TimeServiceError('Test error', 'TEST_ERROR');
      vi.mocked(mockTimeService.getCurrentTime).mockImplementation(() => {
        throw error;
      });

      const result = await useCase.execute();

      expect(result).toEqual({
        success: false,
        error: 'Test error',
      });
    });

    it('should handle unexpected errors', async () => {
      vi.mocked(mockTimeService.getCurrentTime).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await useCase.execute();

      expect(result).toEqual({
        success: false,
        error: 'An unexpected error occurred while retrieving the current time',
      });
    });
  });
});