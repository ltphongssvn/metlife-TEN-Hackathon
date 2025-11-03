// /metlife-TEN-Hackathon/backend/src/models/Message.js
import pool from '../config/database.js';

class Message {
    static async create({ conversationId, userId, messageText, sender, sources = 0, mode = 'agents' }) {
        const result = await pool.query(
            `INSERT INTO messages (conversation_id, user_id, message_text, sender, sources, mode)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [conversationId, userId, messageText, sender, sources, mode]
        );
        return result.rows[0];
    }

    static async findByConversationId(conversationId, limit = 100) {
        const result = await pool.query(
            `SELECT * FROM messages 
       WHERE conversation_id = $1
       ORDER BY created_at ASC
       LIMIT $2`,
            [conversationId, limit]
        );
        return result.rows;
    }

    static async deleteByConversationId(conversationId) {
        await pool.query('DELETE FROM messages WHERE conversation_id = $1', [conversationId]);
    }

    static async getConversationHistory(conversationId, limit = 20) {
        const result = await pool.query(
            `SELECT sender, message_text, created_at
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
            [conversationId, limit]
        );
        return result.rows.reverse();
    }
}

export default Message;