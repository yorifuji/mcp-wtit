export interface ITimeData {
  iso8601: string;
  timestamp: number;
  timezone: string;
}

export interface ITimeZoneInfo {
  name: string;
  offset: number;
}

export interface ITimeFormatOptions {
  includeMilliseconds?: boolean;
  timezone?: string;
}