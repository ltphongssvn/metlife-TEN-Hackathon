// /metlife-TEN-Hackathon/backend/src/services/agent.service.js
import axios from 'axios';

const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8000';

class AgentService {
    constructor() {
        this.client = axios.create({
            baseURL: `${AGENT_API_URL}/api/v1`,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async processQuery(message, userId = 'default-user', chatHistory = null, language = 'en') {
        try {
            // Map language codes to full names for better prompting
            const languageMap = {
                'en': 'English',
                'es': 'Spanish',
                'vi': 'Vietnamese'
            };

            const responseLanguage = languageMap[language] || 'English';

            // Prepend language instruction to the message for the AI agent
            const languageInstruction = language !== 'en'
                ? `Please respond in ${responseLanguage}. `
                : '';

            const response = await this.client.post('/query', {
                message: languageInstruction + message,
                user_id: userId,
                chat_history: chatHistory,
                language: language  // Also pass as separate parameter if the agent API supports it
            });

            return {
                response: response.data.response,
                sources: response.data.sources,
                status: response.data.status,
            };
        } catch (error) {
            console.error('Agent service error FULL:', error.response?.data || error.message || error);
            throw new Error('Failed to process query with agent system');
        }
    }

    async healthCheck() {
        try {
            const response = await axios.get(`${AGENT_API_URL}/health`);
            return response.data;
        } catch (error) {
            console.error('Agent health check failed:', error.message);
            return { status: 'unhealthy' };
        }
    }

    async loadKnowledge(documents) {
        try {
            const response = await this.client.post('/knowledge/load', documents);
            return response.data;
        } catch (error) {
            console.error('Knowledge load error:', error.message);
            throw new Error('Failed to load knowledge base');
        }
    }
}

export default new AgentService();