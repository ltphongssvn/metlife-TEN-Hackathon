// /metlife-TEN-Hackathon/frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    // Authentication
                    "login": "Login",
                    "register": "Register",
                    "email": "Email",
                    "password": "Password", // pragma: allowlist secret
                    "firstName": "First Name",
                    "lastName": "Last Name",
                    "alreadyHaveAccount": "Already have an account?",
                    "dontHaveAccount": "Don't have an account?",

                    // Chat Interface
                    "conversations": "Conversations",
                    "newConversation": "New Conversation",
                    "typeMessage": "Type your message...",
                    "appTitle": "AI Focus Assistant",
                    "messages": "messages",
                    "noConversationsYet": "No conversations yet",
                    "send": "Send",
                    "listening": "Listening...",
                    "hello": "Hello! How can I assist you today?",
                    "howCanIHelp": "How can I help you with your studies today?",
                    "errorSendingMessage": "Sorry, I encountered an error. Please try again.",
                    "showAnalytics": "Show Analytics",
                    "showChat": "Show Chat",
                    "clearConversation": "Clear Conversation",
                    "loadingConversation": "Loading conversation",

                    // Analytics
                    "analytics": "Analytics",
                    "chat": "Chat",
                    "totalSessions": "Total Sessions",
                    "messagesSent": "Messages Sent",
                    "minutesStudied": "Minutes Studied",
                    "avgSession": "Avg Session",
                    "studyActivity": "Study Activity Over Time",
                    "dailyBreakdown": "Daily Activity Breakdown",
                    "last7Days": "Last 7 Days",
                    "last30Days": "Last 30 Days",

                    // Profile
                    "profile": "Profile",
                    "learningStyle": "Learning Style",
                    "studyGoals": "Study Goals",
                    "preferredStudyTimes": "Preferred Study Times",
                    "timezone": "Timezone",
                    "languagePreference": "Language Preference",
                    "saveProfile": "Save Profile",

                    // Common
                    "loading": "Loading...",
                    "error": "Error",
                    "success": "Success",
                    "cancel": "Cancel",
                    "delete": "Delete",
                    "edit": "Edit",
                    "save": "Save",
                    "logout": "Logout",
                    "welcome": "Welcome"
                }
            },
            es: {
                translation: {
                    "login": "Iniciar sesión",
                    "register": "Registrarse",
                    "email": "Correo electrónico",
                    "password": "Contraseña", // pragma: allowlist secret
                    "firstName": "Nombre",
                    "lastName": "Apellido",
                    "alreadyHaveAccount": "¿Ya tienes una cuenta?",
                    "dontHaveAccount": "¿No tienes una cuenta?",

                    "conversations": "Conversaciones",
                    "appTitle": "Asistente de Enfoque IA",
                    "messages": "mensajes",
                    "noConversationsYet": "No hay conversaciones todavía",
                    "newConversation": "Nueva conversación",
                    "typeMessage": "Escribe tu mensaje...",
                    "send": "Enviar",
                    "listening": "Escuchando...",
                    "hello": "¡Hola! ¿Cómo puedo ayudarte hoy?",
                    "howCanIHelp": "¿Cómo puedo ayudarte con tus estudios hoy?",
                    "errorSendingMessage": "Lo siento, encontré un error. Por favor intenta de nuevo.",
                    "showAnalytics": "Mostrar Análisis",
                    "showChat": "Mostrar Chat",
                    "clearConversation": "Limpiar Conversación",
                    "loadingConversation": "Cargando conversación",

                    "analytics": "Analítica",
                    "chat": "Chat",
                    "totalSessions": "Sesiones totales",
                    "messagesSent": "Mensajes enviados",
                    "minutesStudied": "Minutos estudiados",
                    "avgSession": "Sesión promedio",
                    "studyActivity": "Actividad de estudio",
                    "dailyBreakdown": "Desglose diario",
                    "last7Days": "Últimos 7 días",
                    "last30Days": "Últimos 30 días",

                    "profile": "Perfil",
                    "learningStyle": "Estilo de aprendizaje",
                    "studyGoals": "Objetivos de estudio",
                    "preferredStudyTimes": "Horarios preferidos",
                    "timezone": "Zona horaria",
                    "languagePreference": "Idioma preferido",
                    "saveProfile": "Guardar perfil",

                    "loading": "Cargando...",
                    "error": "Error",
                    "success": "Éxito",
                    "cancel": "Cancelar",
                    "delete": "Eliminar",
                    "edit": "Editar",
                    "save": "Guardar",
                    "logout": "Cerrar sesión",
                    "welcome": "Bienvenido"
                }
            },
            vi: {
                translation: {
                    "login": "Đăng nhập",
                    "register": "Đăng ký",
                    "email": "Email",
                    "password": "Mật khẩu", // pragma: allowlist secret
                    "firstName": "Tên",
                    "lastName": "Họ",
                    "alreadyHaveAccount": "Đã có tài khoản?",
                    "dontHaveAccount": "Chưa có tài khoản?",
                    "appTitle": "Trợ lý Tập trung AI",
                    "messages": "tin nhắn",
                    "noConversationsYet": "Chưa có cuộc trò chuyện",

                    "conversations": "Cuộc trò chuyện",
                    "newConversation": "Cuộc trò chuyện mới",
                    "typeMessage": "Nhập tin nhắn...",
                    "send": "Gửi",
                    "listening": "Đang nghe...",
                    "hello": "Xin chào! Tôi có thể giúp gì cho bạn?",
                    "howCanIHelp": "Tôi có thể giúp gì cho việc học của bạn hôm nay?",
                    "errorSendingMessage": "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
                    "showAnalytics": "Hiển thị Phân tích",
                    "showChat": "Hiển thị Trò chuyện",
                    "clearConversation": "Xóa Cuộc trò chuyện",
                    "loadingConversation": "Đang tải cuộc trò chuyện",

                    "analytics": "Phân tích",
                    "chat": "Trò chuyện",
                    "totalSessions": "Tổng phiên",
                    "messagesSent": "Tin nhắn đã gửi",
                    "minutesStudied": "Phút học",
                    "avgSession": "Phiên trung bình",
                    "studyActivity": "Hoạt động học tập",
                    "dailyBreakdown": "Chi tiết hàng ngày",
                    "last7Days": "7 ngày qua",
                    "last30Days": "30 ngày qua",

                    "profile": "Hồ sơ",
                    "learningStyle": "Phong cách học",
                    "studyGoals": "Mục tiêu học tập",
                    "preferredStudyTimes": "Thời gian học ưa thích",
                    "timezone": "Múi giờ",
                    "languagePreference": "Ngôn ngữ ưa thích",
                    "saveProfile": "Lưu hồ sơ",

                    "loading": "Đang tải...",
                    "error": "Lỗi",
                    "success": "Thành công",
                    "cancel": "Hủy",
                    "delete": "Xóa",
                    "edit": "Sửa",
                    "save": "Lưu",
                    "logout": "Đăng xuất",
                    "welcome": "Xin chào"
                }
            }
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;