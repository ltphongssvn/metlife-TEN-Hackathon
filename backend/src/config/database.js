// /metlife-TEN-Hackathon/backend/src/config/database.js
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

// Parse DATABASE_URL or use individual components
const getDatabaseConfig = () => {
    if (process.env.DATABASE_URL) {
        // Parse the connection string
        const url = new URL(process.env.DATABASE_URL);
        return {
            user: url.username,
            password: url.password,
            host: url.hostname,
            port: url.port,
            database: url.pathname.slice(1), // Remove leading '/'
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        };
    }
    
    // Fallback to individual env vars
    return {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'metlife_hackathon',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
};

const pool = new Pool(getDatabaseConfig());

pool.on('connect', () => {
    console.log('Database connected successfully');
});

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    process.exit(-1);
});

export default pool;
