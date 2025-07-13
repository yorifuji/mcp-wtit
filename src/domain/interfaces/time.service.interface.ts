import type { ITimeData, ITimeFormatOptions } from '../../shared/types/time.types.js';

export interface ITimeService {
  getCurrentTime(options?: ITimeFormatOptions): ITimeData;
  getCurrentTimeISO8601(options?: ITimeFormatOptions): string;
  getCurrentTimestamp(): number;
  getTimeZone(): string;
}