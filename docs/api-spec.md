# API Specification
# /metlife-TEN-Hackathon/docs/api-spec.md

## Base URL
```
Development: http://localhost:3001/api/v1
Production: https://your-domain.com/api/v1
```

## Endpoints

### Health Check
**GET** `/health`

Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-01T12:00:00.000Z"
}
```

### Chat

**POST** `/chat`

Send a message to the AI assistant.

**Request Body:**
```json
{
  "message": "I'm feeling pressured to quit school",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "message": "I understand the pressure you're facing...",
  "intent": "seek_encouragement",
  "confidence": 0.95
}
```

**Error Response:**
```json
{
  "error": "Failed to process message",
  "message": "I apologize, but I encountered an error. Please try again."
}
```

### Clear Session

**DELETE** `/chat/session/:userId`

Clear user's conversation session.

**Parameters:**
- `userId` (path): User identifier

**Response:**
```json
{
  "message": "Session cleared successfully"
}
```

## Error Codes

- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (future auth implementation)
- `500` - Internal Server Error

## Authentication

Currently no authentication required. JWT authentication planned for production.

## Rate Limiting

Future implementation planned.
