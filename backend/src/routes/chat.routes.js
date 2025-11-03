// /metlife-TEN-Hackathon/backend/src/routes/chat.routes.js
import express from 'express';
import dialogflowService from '../services/dialogflow.service.js';
import agentService from '../services/agent.service.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = express.Router();

// Send message to chatbot
router.post('/chat', optionalAuth, async (req, res) => {
    try {
        const { message, userId, useAgents = true, conversationId, language = 'en' } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const actualUserId = req.user?.id || userId || 'anonymous';
        let convId = conversationId;

        // Create conversation if authenticated and no conversationId
        if (req.user && !convId) {
            const conversation = await Conversation.create(req.user.id);
            convId = conversation.id;
        }

        // Save user message if authenticated
        if (req.user && convId) {
            await Message.create({
                conversationId: convId,
                userId: req.user.id,
                messageText: message,
                sender: 'user'
            });
        }

        // Retrieve conversation history for context
        let chatHistory = null;
        if (convId) {
            const history = await Message.getConversationHistory(convId, 200);
            // Format history for agent: [{role: 'user', content: '...'}, {role: 'assistant', content: '...'}]
            chatHistory = history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.message_text
            }));
        }

        let response;
        if (useAgents) {
            try {
                // Pass language to agent service
                const agentResponse = await agentService.processQuery(message, actualUserId, chatHistory, language);
                response = {
                    message: agentResponse.response,
                    sources: agentResponse.sources,
                    mode: 'agents',
                    conversationId: convId
                };

                // Save bot message if authenticated
                if (req.user && convId) {
                    await Message.create({
                        conversationId: convId,
                        userId: req.user.id,
                        messageText: agentResponse.response,
                        sender: 'bot',
                        sources: agentResponse.sources,
                        mode: 'agents'
                    });
                }
            } catch (agentError) {
                console.error('Agent system failed, falling back to Dialogflow:', agentError);
                const dialogflowResponse = await dialogflowService.detectIntent(actualUserId, message, language);
                response = {
                    message: dialogflowResponse.message,
                    intent: dialogflowResponse.intent,
                    confidence: dialogflowResponse.confidence,
                    mode: 'dialogflow',
                    conversationId: convId
                };

                if (req.user && convId) {
                    await Message.create({
                        conversationId: convId,
                        userId: req.user.id,
                        messageText: dialogflowResponse.message,
                        sender: 'bot',
                        mode: 'dialogflow'
                    });
                }
            }
        } else {
            const dialogflowResponse = await dialogflowService.detectIntent(actualUserId, message, language);
            response = {
                message: dialogflowResponse.message,
                intent: dialogflowResponse.intent,
                confidence: dialogflowResponse.confidence,
                mode: 'dialogflow',
                conversationId: convId
            };
        }

        res.json(response);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Failed to process message',
            message: 'I apologize, but I encountered an error. Please try again.'
        });
    }
});

// Get user conversations
router.get('/conversations', authenticate, async (req, res) => {
    try {
        const conversations = await Conversation.findByUserId(req.user.id);
        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// Get conversation messages
router.get('/conversations/:id/messages', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const isOwner = await Conversation.verifyOwnership(id, req.user.id);

        if (!isOwner) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const messages = await Message.findByConversationId(id);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Delete conversation
router.delete('/conversations/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const isOwner = await Conversation.verifyOwnership(id, req.user.id);

        if (!isOwner) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await Conversation.delete(id);
        res.json({ message: 'Conversation deleted' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
});

// Clear user session
router.delete('/chat/session/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        dialogflowService.clearSession(userId);
        res.json({ message: 'Session cleared successfully' });
    } catch (error) {
        console.error('Session clear error:', error);
        res.status(500).json({ error: 'Failed to clear session' });
    }
});

// Agent health check
router.get('/agents/health', async (req, res) => {
    try {
        const health = await agentService.healthCheck();
        res.json(health);
    } catch (error) {
        res.status(503).json({ status: 'unhealthy', error: error.message });
    }
});

export default router;