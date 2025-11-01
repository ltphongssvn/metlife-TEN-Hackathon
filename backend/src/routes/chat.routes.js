// /metlife-TEN-Hackathon/backend/src/routes/chat.routes.js
import express from 'express';
import dialogflowService from '../services/dialogflow.service.js';

const router = express.Router();

// Send message to chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message, userId = 'default-user' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await dialogflowService.detectIntent(userId, message);
    
    res.json({
      message: response.message,
      intent: response.intent,
      confidence: response.confidence,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: 'I apologize, but I encountered an error. Please try again.'
    });
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

export default router;
