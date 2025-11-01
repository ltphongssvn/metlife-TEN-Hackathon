# Backend - Node.js API Server
# /metlife-TEN-Hackathon/backend/README.md

## Overview
Node.js/Express server handling API requests and Dialogflow integration.

## Features
- RESTful API endpoints
- Dialogflow API integration
- Google Cloud Speech-to-Text/Text-to-Speech
- WebSocket support for real-time conversations
- User session management
- Authentication & authorization

## Tech Stack
- Node.js 18+
- Express.js
- Google Cloud SDK
- Dialogflow SDK
- WebSocket (ws or socket.io)
- JWT authentication

## Setup
```bash
npm install
npm run dev
```

## Environment Variables
Create `.env` file:
```
NODE_ENV=development
PORT=3001
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
DIALOGFLOW_PROJECT_ID=your_project_id
JWT_SECRET=your_jwt_secret
```
