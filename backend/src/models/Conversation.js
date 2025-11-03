// /metlife-TEN-Hackathon/backend/src/models/Conversation.js
import pool from '../config/database.js';

class Conversation {
    static async create(userId, title = 'New Conversation') {
        const result = await pool.query(
            `INSERT INTO conversations (user_id, title)
       VALUES ($1, $2)
       RETURNING id, user_id, title, created_at`,
            [userId, title]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            'SELECT * FROM conversations WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async findByUserId(userId, limit = 50) {
        const result = await pool.query(
            `SELECT c.*, 
              COUNT(m.id) as message_count,
              MAX(m.created_at) as last_message_at
       FROM conversations c
       LEFT JOIN messages m ON c.id = m.conversation_id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY last_message_at DESC NULLS LAST
       LIMIT $2`,
            [userId, limit]
        );
        return result.rows;
    }

    static async update(id, title) {
        const result = await pool.query(
            `UPDATE conversations 
       SET title = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
            [title, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM conversations WHERE id = $1', [id]);
    }

    static async verifyOwnership(conversationId, userId) {
        const result = await pool.query(
            'SELECT user_id FROM conversations WHERE id = $1',
            [conversationId]
        );
        return result.rows[0]?.user_id === userId;
    }
}

export default Conversation;