// /metlife-TEN-Hackathon/backend/src/models/User.js
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
    static async create({ email, password, firstName, lastName }) {
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, first_name, last_name)
             VALUES ($1, $2, $3, $4)
             RETURNING id, email, first_name, last_name, created_at`,
            [email, passwordHash, firstName, lastName]
        );
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async verifyPassword(plainPassword, passwordHash) {
        return await bcrypt.compare(plainPassword, passwordHash);
    }

    static async updatePassword(userId, newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [passwordHash, userId]
        );
    }

    static async updateProfile(userId, { learningStyle, studyGoals, preferredStudyTimes, languagePreference, timezone }) {
        const result = await pool.query(
            `UPDATE users 
             SET learning_style = $1, 
                 study_goals = $2, 
                 preferred_study_times = $3,
                 language_preference = $4,
                 timezone = $5,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING id, email, first_name, last_name, learning_style, study_goals, 
                       preferred_study_times, language_preference, timezone`,
            [learningStyle, studyGoals, preferredStudyTimes, languagePreference, timezone, userId]
        );
        return result.rows[0];
    }

    static async getProfile(userId) {
        const result = await pool.query(
            `SELECT id, email, first_name, last_name, learning_style, study_goals,
                    preferred_study_times, language_preference, timezone, 
                    notification_preferences, created_at
             FROM users WHERE id = $1`,
            [userId]
        );
        return result.rows[0];
    }
}

export default User;