# Debugging Guide

## MCP Inspector

MCP Inspector is a powerful web-based tool for debugging and testing MCP servers. It provides real-time visibility into server behavior and tool execution.

### Getting Started

1. **Build the project** (required for first run):
   ```bash
   npm run build
   ```

2. **Launch MCP Inspector**:
   ```bash
   npm run inspect
   ```

3. The Inspector will:
   - Start a proxy server on `localhost:6277`
   - Open a web interface at `http://localhost:6274`
   - Automatically connect to your MCP server

### Using the Inspector

#### Testing Tools

1. **View Available Tools**
   - Once connected, you'll see `get_current_time` and `get_iso8601_time` in the tools list
   - Click on a tool to view its schema and parameters

2. **Execute Tool Calls**
   - Select a tool from the list
   - Enter parameters in the JSON editor:
     ```json
     {
       "timezone": "Asia/Tokyo",
       "includeMilliseconds": true
     }
     ```
   - Click "Execute" to run the tool
   - View the response in real-time

#### Monitoring Communication

The Inspector shows:
- **Request Details**: Full MCP protocol requests
- **Response Data**: Complete server responses
- **Timing Information**: Execution duration
- **Error Messages**: Detailed error information if calls fail

### Common Test Scenarios

#### 1. Basic Time Request
```json
{}
```
Returns current UTC time with milliseconds.

#### 2. Specific Timezone
```json
{
  "timezone": "America/New_York"
}
```
Returns time in New York timezone.

#### 3. Without Milliseconds
```json
{
  "includeMilliseconds": false,
  "timezone": "Europe/London"
}
```
Returns London time without milliseconds.

#### 4. Invalid Timezone (Error Testing)
```json
{
  "timezone": "Invalid/Timezone"
}
```
Should return an error message.

### Debugging Tips

1. **Check Server Logs**: The terminal running `npm run inspect` shows server-side logs
2. **Validate Parameters**: Use the schema view to ensure correct parameter types
3. **Test Edge Cases**: Try empty parameters, invalid values, and boundary conditions
4. **Monitor Performance**: Check response times for optimization opportunities

### Troubleshooting

#### Server Won't Connect
- Ensure the project is built: `npm run build`
- Check that no other process is using the required ports
- Verify Node.js version compatibility (≥18.0.0)

#### Tools Not Showing
- Confirm the server started successfully (check terminal logs)
- Refresh the Inspector page
- Check browser console for errors

#### Unexpected Responses
- Verify parameter format matches the schema
- Check timezone validity against IANA database
- Review server implementation for edge cases