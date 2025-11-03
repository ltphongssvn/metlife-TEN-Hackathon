// /metlife-TEN-Hackathon/frontend/src/components/ConversationList.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import './ConversationList.css';

const ConversationList = ({ onSelectConversation, currentConversationId }) => {
    const { t } = useTranslation();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const response = await api.getConversations();
            setConversations(response.data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return <div className="conversation-list-loading">{t('loading')}</div>;
    }

    return (
        <div className="conversation-list">
            <div className="conversation-list-header">
                <h3>{t('conversations')}</h3>
                <button onClick={loadConversations} className="refresh-btn">
                    ↻
                </button>
            </div>
            <div className="conversation-items">
                {conversations.length === 0 ? (
                    <div className="no-conversations">{t("noConversationsYet")}</div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`conversation-item ${
                                conv.id === currentConversationId ? 'active' : ''
                            }`}
                            onClick={() => onSelectConversation(conv.id)}
                        >
                            <div className="conversation-title">
                                {conv.title === 'New Conversation' ? t('newConversation') : (conv.title || t('newConversation'))}
                            </div>
                            <div className="conversation-meta">
                                <span className="message-count">
                                    {conv.message_count || 0} {t("messages")}
                                </span>
                                <span className="conversation-time">
                                    {formatDate(conv.last_message_at || conv.created_at)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationList;