// /metlife-TEN-Hackathon/frontend/src/hooks/useSpeechSynthesis.js
import { useEffect, useState } from 'react';

const useSpeechSynthesis = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    
    useEffect(() => {
        setIsSupported('speechSynthesis' in window);
    }, []);
    
    // Map i18n language codes to speech synthesis locale codes
    const getSynthesisLang = (lang) => {
        const langMap = {
            'en': 'en-US',
            'vi': 'vi-VN',
            'es': 'es-ES',
            'zh': 'zh-CN',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'ja': 'ja-JP',
            'ko': 'ko-KR'
        };
        return langMap[lang] || lang || 'en-US';
    };
    
    const speak = (text, language = 'en') => {
        if (!isSupported || !text) return;
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = getSynthesisLang(language);
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
    };
    
    const stop = () => {
        if (isSupported) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };
    
    return { speak, stop, isSpeaking, isSupported };
};

export default useSpeechSynthesis;
