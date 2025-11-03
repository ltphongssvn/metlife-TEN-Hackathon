// /metlife-TEN-Hackathon/frontend/src/components/VoiceInput.js
import React, { useState, useRef } from 'react';
import './VoiceInput.css';

const VoiceInput = ({ onTranscript, disabled, language = 'en' }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const mediaRecorderRef = useRef(null);
    const recognitionRef = useRef(null);
    const chunksRef = useRef([]);
    const fullTranscriptRef = useRef('');

    // Map language codes to speech recognition locale codes
    const getRecognitionLanguage = (lang) => {
        const langMap = {
            'en': 'en-US',
            'es': 'es-ES',
            'vi': 'vi-VN'
        };
        return langMap[lang] || 'en-US';
    };

    const startListening = async () => {
        if (!navigator.mediaDevices || disabled) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Use MediaRecorder for continuous recording
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            fullTranscriptRef.current = '';

            // Set up Web Speech API for transcription
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                setIsSupported(false);
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = getRecognitionLanguage(language);

            let isRestarting = false;

            recognition.onresult = (event) => {
                let interim = '';
                let final = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcript + ' ';
                    } else {
                        interim = transcript;
                    }
                }

                if (final) {
                    fullTranscriptRef.current += final;
                }

                const currentTranscript = fullTranscriptRef.current + interim;
                if (onTranscript) {
                    onTranscript(currentTranscript);
                }
            };

            recognition.onend = () => {
                // Restart if still recording
                if (isListening && !isRestarting) {
                    isRestarting = true;
                    setTimeout(() => {
                        if (isListening) {
                            try {
                                recognition.start();
                                isRestarting = false;
                            } catch (e) {
                                console.log('Restart failed:', e);
                            }
                        }
                    }, 50);
                }
            };

            recognition.onerror = (event) => {
                if (event.error === 'no-speech' && isListening) {
                    // Silent restart on no-speech
                    setTimeout(() => {
                        if (isListening) {
                            try {
                                recognition.start();
                            } catch (e) {
                                console.log('Restart failed:', e);
                            }
                        }
                    }, 50);
                }
            };

            recognitionRef.current = recognition;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
            };

            // Start both recording and recognition
            mediaRecorder.start(100); // Collect data every 100ms
            recognition.start();
            setIsListening(true);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            setIsSupported(false);
        }
    };

    const stopListening = () => {
        setIsListening(false);

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        // Send final transcript
        const finalText = fullTranscriptRef.current.trim();
        if (finalText && onTranscript) {
            onTranscript(finalText);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    if (!isSupported) {
        return <div className="voice-input-unsupported">🎤 Not supported</div>;
    }

    return (
        <button
            type="button"
            className={`voice-input-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            disabled={disabled}
            title={isListening ? 'Recording... Click to stop' : 'Click to speak'}
        >
            {isListening ? (
                <>
                    <span className="pulse-animation"></span>
                    <span style={{color: 'red'}}>⏹</span>
                </>
            ) : (
                '🎤'
            )}
        </button>
    );
};

export default VoiceInput;