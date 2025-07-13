import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetISO8601TimeUseCase } from '../../../../src/application/usecases/get-iso8601-time.usecase.js';
import type { ITimeService } from '../../../../src/domain/interfaces/time.service.interface.js';
import { TimeServiceError } from '../../../../src/shared/errors/time.errors.js';

describe('GetISO8601TimeUseCase', () => {
  let useCase: GetISO8601TimeUseCase;
  let mockTimeService: ITimeService;

  beforeEach(() => {
    mockTimeService = {
      getCurrentTime: vi.fn(),
      getCurrentTimeISO8601: vi.fn(),
      getCurrentTimestamp: vi.fn(),
      getTimeZone: vi.fn(),
    };
    useCase = new GetISO8601TimeUseCase(mockTimeService);
  });

  describe('execute', () => {
    it('should return success with ISO8601 time', async () => {
      const mockISO8601 = '2024-01-15T10:30:45.123Z';
      vi.mocked(mockTimeService.getCurrentTimeISO8601).mockReturnValue(mockISO8601);

      const result = await useCase.execute();

      expect(result).toEqual({
        success: true,
        iso8601: mockISO8601,
      });
      expect(mockTimeService.getCurrentTimeISO8601).toHaveBeenCalledWith({});
    });

    it('should pass options to time service', async () => {
      const mockISO8601 = '2024-01-15T05:30:45-05:00';
      vi.mocked(mockTimeService.getCurrentTimeISO8601).mockReturnValue(mockISO8601);

      const input = {
        includeMilliseconds: false,
        timezone: 'America/New_York',
      };
      const result = await useCase.execute(input);

      expect(result).toEqual({
        success: true,
        iso8601: mockISO8601,
      });
      expect(mockTimeService.getCurrentTimeISO8601).toHaveBeenCalledWith(input);
    });

    it('should handle TimeServiceError', async () => {
      const error = new TimeServiceError('Format error', 'FORMAT_ERROR');
      vi.mocked(mockTimeService.getCurrentTimeISO8601).mockImplementation(() => {
        throw error;
      });

      const result = await useCase.execute();

      expect(result).toEqual({
        success: false,
        error: 'Format error',
      });
    });

    it('should handle unexpected errors', async () => {
      vi.mocked(mockTimeService.getCurrentTimeISO8601).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await useCase.execute();

      expect(result).toEqual({
        success: false,
        error: 'An unexpected error occurred while retrieving the ISO8601 time',
      });
    });
  });
});