# API Documentation

## Tools

### `get_current_time`

Get the current time with detailed information including ISO8601 format, timestamp, and timezone.

#### Parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `includeMilliseconds` | boolean | No | true | Include milliseconds in the ISO8601 format |
| `timezone` | string | No | "UTC" | Timezone for the time. Examples: "UTC", "America/New_York", "Asia/Tokyo" |

#### Response

```json
{
  "iso8601": "2024-01-15T10:30:45.123Z",
  "timestamp": 1705315845123,
  "timezone": "UTC"
}
```

#### Example Usage

```json
// Request
{
  "tool": "get_current_time",
  "arguments": {
    "includeMilliseconds": false,
    "timezone": "America/New_York"
  }
}

// Response
{
  "iso8601": "2024-01-15T05:30:45-05:00",
  "timestamp": 1705315845000,
  "timezone": "America/New_York"
}
```

## Error Handling

### Error Types

1. **Invalid Timezone Error**
   - Code: `INVALID_TIMEZONE`
   - Message: `Invalid timezone: {timezone}`
   - Occurs when an invalid timezone is provided

2. **Format Error**
   - Code: `FORMAT_ERROR`
   - Message: `Failed to format date: {details}`
   - Occurs when date formatting fails

### Error Response Format

```json
{
  "error": "Error message here"
}
```

## Supported Timezones

The server supports all IANA timezone identifiers. Common examples:

- `UTC`
- `America/New_York`
- `America/Los_Angeles`
- `Europe/London`
- `Europe/Paris`
- `Asia/Tokyo`
- `Asia/Shanghai`
- `Australia/Sydney`

For a complete list, see [IANA Time Zone Database](https://www.iana.org/time-zones).