// /metlife-TEN-Hackathon/backend/src/services/dialogflow.service.js
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';

class DialogflowService {
  constructor() {
    this.projectId = process.env.DIALOGFLOW_PROJECT_ID;
    this.sessionClient = new SessionsClient();
    this.sessions = new Map();
  }

  getOrCreateSession(userId) {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, uuidv4());
    }
    return this.sessions.get(userId);
  }

  async detectIntent(userId, text, languageCode = 'en') {
    try {
      const sessionId = this.getOrCreateSession(userId);
      const sessionPath = this.sessionClient.projectAgentSessionPath(
        this.projectId,
        sessionId
      );

      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: text,
            languageCode: languageCode,
          },
        },
      };

      const [response] = await this.sessionClient.detectIntent(request);
      return this.formatResponse(response);
    } catch (error) {
      console.error('Dialogflow error:', error);
      throw new Error('Failed to process message with Dialogflow');
    }
  }

  formatResponse(response) {
    const result = response.queryResult;
    
    return {
      message: result.fulfillmentText,
      intent: result.intent?.displayName,
      confidence: result.intentDetectionConfidence,
      parameters: result.parameters,
      allRequiredParamsPresent: result.allRequiredParamsPresent,
    };
  }

  clearSession(userId) {
    this.sessions.delete(userId);
  }
}

export default new DialogflowService();
