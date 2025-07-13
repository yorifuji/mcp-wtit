import type { ITimeService } from '../interfaces/time.service.interface.js';
import type { ITimeData, ITimeFormatOptions } from '../../shared/types/time.types.js';
import { InvalidTimeZoneError, TimeFormatError } from '../../shared/errors/time.errors.js';

export class TimeService implements ITimeService {
  private readonly defaultOptions: ITimeFormatOptions = {
    includeMilliseconds: true,
    timezone: 'UTC',
  };

  getCurrentTime(options?: ITimeFormatOptions): ITimeData {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const now = new Date();
    
    return {
      iso8601: this.formatToISO8601(now, mergedOptions),
      timestamp: now.getTime(),
      timezone: mergedOptions.timezone || this.getTimeZone(),
    };
  }

  getCurrentTimeISO8601(options?: ITimeFormatOptions): string {
    const mergedOptions = { ...this.defaultOptions, ...options };
    return this.formatToISO8601(new Date(), mergedOptions);
  }

  getCurrentTimestamp(): number {
    return Date.now();
  }

  getTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  private formatToISO8601(date: Date, options: ITimeFormatOptions): string {
    try {
      if (options.timezone && options.timezone !== 'UTC') {
        return this.formatWithTimeZone(date, options.timezone, options.includeMilliseconds);
      }

      const iso = date.toISOString();
      return options.includeMilliseconds ? iso : iso.replace(/\.\d{3}/, '');
    } catch (error) {
      throw new TimeFormatError(`Failed to format date: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private formatWithTimeZone(date: Date, timezone: string, includeMilliseconds?: boolean): string {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(date);
      const dateParts: Record<string, string> = {};
      
      parts.forEach(part => {
        if (part.type !== 'literal') {
          dateParts[part.type] = part.value;
        }
      });

      let iso = `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;
      
      if (includeMilliseconds) {
        iso += `.${date.getMilliseconds().toString().padStart(3, '0')}`;
      }

      const offset = this.getTimeZoneOffset(date, timezone);
      iso += offset;

      return iso;
    } catch {
      throw new InvalidTimeZoneError(timezone);
    }
  }

  private getTimeZoneOffset(date: Date, timezone: string): string {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / 60000;

    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';

    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}