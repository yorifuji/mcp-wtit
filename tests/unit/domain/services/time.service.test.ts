import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TimeService } from '../../../../src/domain/services/time.service.js';

describe('TimeService', () => {
  let timeService: TimeService;
  let mockDate: Date;

  beforeEach(() => {
    timeService = new TimeService();
    mockDate = new Date('2024-01-15T10:30:45.123Z');
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCurrentTime', () => {
    it('should return current time data with default options', () => {
      const result = timeService.getCurrentTime();

      expect(result).toEqual({
        iso8601: '2024-01-15T10:30:45.123Z',
        timestamp: mockDate.getTime(),
        timezone: 'UTC',
      });
    });

    it('should return current time without milliseconds when specified', () => {
      const result = timeService.getCurrentTime({ includeMilliseconds: false });

      expect(result).toEqual({
        iso8601: '2024-01-15T10:30:45Z',
        timestamp: mockDate.getTime(),
        timezone: 'UTC',
      });
    });

    it('should return current time for a specific timezone', () => {
      const result = timeService.getCurrentTime({ timezone: 'America/New_York' });

      expect(result.timestamp).toBe(mockDate.getTime());
      expect(result.timezone).toBe('America/New_York');
      expect(result.iso8601).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);
    });

    it('should throw error for invalid timezone', () => {
      expect(() => {
        timeService.getCurrentTime({ timezone: 'Invalid/Timezone' });
      }).toThrow('Failed to format date: Invalid timezone: Invalid/Timezone');
    });
  });

  describe('getCurrentTimeISO8601', () => {
    it('should return ISO8601 formatted time string', () => {
      const result = timeService.getCurrentTimeISO8601();

      expect(result).toBe('2024-01-15T10:30:45.123Z');
    });

    it('should return ISO8601 without milliseconds when specified', () => {
      const result = timeService.getCurrentTimeISO8601({ includeMilliseconds: false });

      expect(result).toBe('2024-01-15T10:30:45Z');
    });
  });

  describe('getCurrentTimestamp', () => {
    it('should return current timestamp', () => {
      const result = timeService.getCurrentTimestamp();

      expect(result).toBe(mockDate.getTime());
    });
  });

  describe('getTimeZone', () => {
    it('should return the system timezone', () => {
      const result = timeService.getTimeZone();

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases and branch coverage', () => {
    it('should handle timezone option but timezone is not provided', () => {
      const result = timeService.getCurrentTime({ timezone: undefined });

      expect(result.timezone).toBe(timeService.getTimeZone());
    });

    it('should handle non-Error thrown in formatToISO8601', () => {
      // Mock Date.toISOString to throw a non-Error
      const originalToISOString = Date.prototype.toISOString;
      Date.prototype.toISOString = () => {
        throw 'Not an error object';
      };

      try {
        expect(() => {
          timeService.getCurrentTime();
        }).toThrow('Failed to format date: Unknown error');
      } finally {
        Date.prototype.toISOString = originalToISOString;
      }
    });

    it('should handle getTimeZoneOffset edge case', () => {
      // Test with timezone that results in exact hour offset
      const result = timeService.getCurrentTime({ timezone: 'Europe/London' });

      expect(result.iso8601).toMatch(/[+-]\d{2}:00$/);
    });
  });
});