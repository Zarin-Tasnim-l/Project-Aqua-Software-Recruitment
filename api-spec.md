# Telemetry API Specification

### POST /api/telemetry
- **Description:** Submit new telemetry data
- **Request Body (JSON):**
{
  "depth": 10.5,          # meters
  "pressure": 1.2,        # bar
  "temperature": 22.3,    # °C
  "direction": 120,       # degrees wrt North
  "timestamp": "2026-02-09T10:00:00Z"
}
- **Responses:**
  - 200: Data stored successfully
  - 400: Invalid payload

### GET /api/telemetry/latest
- **Description:** Returns the most recent telemetry entry
- **Response Body (JSON):**
{
  "depth": 10.5,
  "pressure": 1.2,
  "temperature": 22.3,
  "direction": 120,
  "timestamp": "2026-02-09T10:00:00Z"
}

### GET /api/telemetry/history?limit=N
- **Description:** Returns last N telemetry entries
- **Parameters:**
  - limit (integer): maximum number of records to retrieve
- **Response Body (JSON):** An array of telemetry objects
