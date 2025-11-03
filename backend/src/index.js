// /metlife-TEN-Hackathon/backend/src/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes.js';
import authRoutes from './routes/auth.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'MetLife TEN Hackathon - AI Focus Assistant API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/health',
            api: '/api/v1',
            auth: '/api/v1/auth',
            chat: '/api/v1/chat',
            analytics: '/api/v1/analytics'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/v1', (req, res) => {
    res.json({
        message: 'MetLife TEN Hackathon - AI Focus Assistant API',
        version: '1.0.0'
    });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1', chatRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});