// /metlife-TEN-Hackathon/backend/src/models/StudySession.js
import pool from '../config/database.js';

class StudySession {
    static async create({ userId, conversationId }) {
        const result = await pool.query(
            `INSERT INTO study_sessions (user_id, conversation_id, start_time)
             VALUES ($1, $2, CURRENT_TIMESTAMP)
             RETURNING *`,
            [userId, conversationId]
        );
        return result.rows[0];
    }

    static async end(sessionId, messageCount) {
        const result = await pool.query(
            `UPDATE study_sessions 
             SET end_time = CURRENT_TIMESTAMP,
                 duration_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - start_time))/60,
                 message_count = $1
             WHERE id = $2
             RETURNING *`,
            [messageCount, sessionId]
        );
        return result.rows[0];
    }

    static async getUserStats(userId, days = 7) {
        const result = await pool.query(
            `SELECT 
                COUNT(*) as total_sessions,
                SUM(message_count) as total_messages,
                AVG(duration_minutes) as avg_duration,
                SUM(duration_minutes) as total_minutes
             FROM study_sessions
             WHERE user_id = $1 
               AND start_time >= NOW() - INTERVAL '${days} days'
               AND end_time IS NOT NULL`,
            [userId]
        );
        return result.rows[0];
    }

    static async getDailyActivity(userId, days = 30) {
        const result = await pool.query(
            `SELECT 
                DATE(start_time) as date,
                COUNT(*) as session_count,
                SUM(message_count) as message_count,
                SUM(duration_minutes) as total_minutes
             FROM study_sessions
             WHERE user_id = $1 
               AND start_time >= NOW() - INTERVAL '${days} days'
               AND end_time IS NOT NULL
             GROUP BY DATE(start_time)
             ORDER BY date DESC`,
            [userId]
        );
        return result.rows;
    }
}

export default StudySession;
