// /metlife-TEN-Hackathon/backend/src/routes/speech.routes.js
import express from 'express';
import speech from '@google-cloud/speech';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const speechClient = new speech.SpeechClient();

router.post('/stream', authenticateToken, (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const request = {
        config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: req.body.language || 'en-US',
            enableAutomaticPunctuation: true,
            model: 'latest_long'
        },
        interimResults: true,
        singleUtterance: false
    };

    const recognizeStream = speechClient
        .streamingRecognize(request)
        .on('data', (data) => {
            if (data.results[0]) {
                const result = data.results[0];
                res.write(`data: ${JSON.stringify({
                    transcript: result.alternatives[0].transcript,
                    isFinal: result.isFinal
                })}\n\n`);
            }
        })
        .on('error', (error) => {
            console.error('Speech error:', error);
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        })
        .on('end', () => {
            res.end();
        });

    req.on('data', (chunk) => {
        recognizeStream.write(chunk);
    });

    req.on('end', () => {
        recognizeStream.end();
    });
});

export default router;