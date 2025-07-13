export class TimeServiceError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'TimeServiceError';
    Object.setPrototypeOf(this, TimeServiceError.prototype);
  }
}

export class InvalidTimeZoneError extends TimeServiceError {
  constructor(timezone: string) {
    super(`Invalid timezone: ${timezone}`, 'INVALID_TIMEZONE');
  }
}

export class TimeFormatError extends TimeServiceError {
  constructor(message: string) {
    super(message, 'FORMAT_ERROR');
  }
}