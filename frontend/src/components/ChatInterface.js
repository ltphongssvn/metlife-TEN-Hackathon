// /metlife-TEN-Hackathon/frontend/src/components/ChatInterface.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConversationList from './ConversationList';
import AnalyticsDashboard from './AnalyticsDashboard';
import VoiceInput from './VoiceInput';
import LanguageSwitcher from './LanguageSwitcher';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import { api } from '../services/api';
import './ChatInterface.css';

const ChatInterface = ({ user, onLogout }) => {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [showSidebar, setShowSidebar] = useState(true);
    const [activeTab, setActiveTab] = useState('chat');
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editText, setEditText] = useState('');
    const { speak, speaking, cancel } = useSpeechSynthesis();

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const response = await api.getConversations();
            setConversations(response.data);
            if (response.data.length > 0 && !conversationId) {
                loadConversation(response.data[0].id);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    };

    const loadConversation = async (id) => {
        try {
            const response = await api.getConversationMessages(id);
            setMessages(response.data.map((msg, index) => ({
                ...msg,
                id: msg.id || `msg-${index}`,
                isEdited: false
            })));
            setConversationId(id);
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: `msg-${Date.now()}`,
            message_text: inputMessage,
            sender: 'user',
            created_at: new Date().toISOString(),
            isEdited: false
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        await sendToBot(inputMessage);
    };

    const sendToBot = async (message) => {
        setIsLoading(true);
        try {
            const response = await api.sendMessage(message, conversationId, i18n.language);
            const botMessage = {
                id: `msg-${Date.now() + 1}`,
                message_text: response.data.message,
                sender: 'bot',
                sources: response.data.sources,
                created_at: new Date().toISOString(),
                isEdited: false
            };
            setMessages(prev => [...prev, botMessage]);
            setConversationId(response.data.conversationId);
            loadConversations();

            if (response.data.message) {
                speak(response.data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: `msg-${Date.now() + 1}`,
                message_text: t('errorSendingMessage'),
                sender: 'bot',
                created_at: new Date().toISOString(),
                isEdited: false
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (messageId, text) => {
        setEditingMessageId(messageId);
        setEditText(text);
    };

    const handleEditSubmit = async (messageId) => {
        if (!editText.trim()) return;

        // Find message index
        const messageIndex = messages.findIndex(msg => msg.id === messageId);

        // Update the message and remove all messages after it
        const updatedMessages = messages.slice(0, messageIndex).concat([{
            ...messages[messageIndex],
            message_text: editText,
            isEdited: true
        }]);

        setMessages(updatedMessages);

        // Cancel edit mode
        setEditingMessageId(null);
        setEditText('');

        // Resend to bot
        await sendToBot(editText);
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditText('');
    };

    const handleVoiceInput = (transcript) => {
        setInputMessage(transcript);
    };

    const handleNewConversation = async () => {
        setMessages([]);
        setConversationId(null);
        loadConversations();
    };

    return (
        <div className="chat-container">
            {showSidebar && (
                <ConversationList
                    conversations={conversations}
                    activeConversationId={conversationId}
                    onSelectConversation={loadConversation}
                    onNewConversation={handleNewConversation}
                    onRefresh={loadConversations}
                />
            )}
            <div className="chat-main-area">
                <div className="chat-header">
                    <button
                        className="sidebar-toggle"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        ☰
                    </button>
                    <h1>{t("appTitle")}</h1>
                    <div className="header-controls">
                        <LanguageSwitcher />
                        <div className="tab-buttons">
                            <button
                                className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                                onClick={() => setActiveTab('chat')}
                            >
                                {t('chat')}
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                                onClick={() => setActiveTab('analytics')}
                            >
                                {t('analytics')}
                            </button>
                        </div>
                        <span className="username">
                            {t('welcome')}, {user?.firstName || 'User'}!
                        </span>
                        <button className="logout-btn" onClick={onLogout}>
                            {t('logout')}
                        </button>
                    </div>
                </div>
                {activeTab === 'chat' ? (
                    <div className="chat-content">
                        <div className="messages-container">
                            {messages.length === 0 ? (
                                <div className="welcome-message">
                                    <h2>{t('hello')}</h2>
                                    <p>{t('howCanIHelp')}</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <div
                                        key={msg.id}
                                        className={`message ${msg.sender === 'user' ? 'user' : 'assistant'}`}
                                    >
                                        <div className="message-content">
                                            {editingMessageId === msg.id ? (
                                                <div className="edit-container">
                                                    <textarea
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        className="edit-textarea"
                                                        autoFocus
                                                    />
                                                    <div className="edit-buttons">
                                                        <button
                                                            onClick={() => handleEditSubmit(msg.id)}
                                                            className="save-edit-btn"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="cancel-edit-btn"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="message-text">
                                                        {msg.message_text}
                                                        {msg.isEdited && <span className="edited-tag"> (edited)</span>}
                                                    </div>
                                                    {msg.sender === 'user' && (
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(msg.id, msg.message_text)}
                                                            title="Edit message"
                                                        >
                                                            ✏️
                                                        </button>
                                                    )}
                                                    {msg.sources && (
                                                        <div className="message-sources">
                                                            Sources: {msg.sources}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            {isLoading && (
                                <div className="message assistant loading">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="chat-input-form">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder={t('typeMessage')}
                                disabled={isLoading}
                            />
                            <VoiceInput
                                onTranscript={handleVoiceInput}
                                disabled={isLoading}
                                language={i18n.language}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputMessage.trim()}
                            >
                                {t('send')}
                            </button>
                        </form>
                    </div>
                ) : (
                    <AnalyticsDashboard />
                )}
            </div>
        </div>
    );
};

export default ChatInterface;