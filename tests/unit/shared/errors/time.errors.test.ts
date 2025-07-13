import { describe, it, expect } from 'vitest';
import { TimeServiceError, InvalidTimeZoneError, TimeFormatError } from '../../../../src/shared/errors/time.errors.js';

describe('Time Errors', () => {
  describe('TimeServiceError', () => {
    it('should create error with message and code', () => {
      const error = new TimeServiceError('Test error message', 'TEST_CODE');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TimeServiceError);
      expect(error.message).toBe('Test error message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('TimeServiceError');
    });

    it('should maintain proper prototype chain', () => {
      const error = new TimeServiceError('Test', 'CODE');

      expect(error instanceof TimeServiceError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('InvalidTimeZoneError', () => {
    it('should create error with timezone in message', () => {
      const error = new InvalidTimeZoneError('Invalid/Timezone');

      expect(error).toBeInstanceOf(TimeServiceError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Invalid timezone: Invalid/Timezone');
      expect(error.code).toBe('INVALID_TIMEZONE');
      expect(error.name).toBe('TimeServiceError');
    });

    it('should handle empty timezone', () => {
      const error = new InvalidTimeZoneError('');

      expect(error.message).toBe('Invalid timezone: ');
      expect(error.code).toBe('INVALID_TIMEZONE');
    });
  });

  describe('TimeFormatError', () => {
    it('should create error with custom message', () => {
      const error = new TimeFormatError('Failed to format date');

      expect(error).toBeInstanceOf(TimeServiceError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Failed to format date');
      expect(error.code).toBe('FORMAT_ERROR');
      expect(error.name).toBe('TimeServiceError');
    });

    it('should handle detailed error messages', () => {
      const error = new TimeFormatError('Failed to format date: Invalid input');

      expect(error.message).toBe('Failed to format date: Invalid input');
      expect(error.code).toBe('FORMAT_ERROR');
    });
  });
});