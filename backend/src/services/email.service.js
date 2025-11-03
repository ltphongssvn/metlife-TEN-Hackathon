// /metlife-TEN-Hackathon/backend/src/services/email.service.js
import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendStudyReminder(userEmail, userName) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: userEmail,
            subject: 'Study Reminder - AI Focus Assistant',
            html: `
                <h2>Time to Study! 📚</h2>
                <p>Hi ${userName},</p>
                <p>This is your friendly reminder to spend some time on your studies today.</p>
                <p>Remember your long-term goals and the progress you're making!</p>
                <ul>
                    <li>Review your notes</li>
                    <li>Complete assignments</li>
                    <li>Chat with your AI Focus Assistant for guidance</li>
                </ul>
                <p>Keep up the great work! 💪</p>
                <br>
                <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Start Studying</a></p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Study reminder sent to ${userEmail}`);
            return { success: true };
        } catch (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWeeklySummary(userEmail, userName, stats) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: userEmail,
            subject: 'Your Weekly Study Summary - AI Focus Assistant',
            html: `
                <h2>Your Week in Review 📊</h2>
                <p>Hi ${userName},</p>
                <p>Here's your study activity for the past week:</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Total Sessions:</strong> ${stats.totalSessions}</p>
                    <p><strong>Messages Sent:</strong> ${stats.totalMessages}</p>
                    <p><strong>Study Time:</strong> ${stats.totalMinutes} minutes</p>
                    <p><strong>Average Session:</strong> ${stats.avgDuration} minutes</p>
                </div>
                <p>Keep up the momentum! Consistency is key to achieving your educational goals.</p>
                <br>
                <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Continue Learning</a></p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Weekly summary sent to ${userEmail}`);
            return { success: true };
        } catch (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }
    }

    async sendMotivationalEmail(userEmail, userName, message) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: userEmail,
            subject: 'Stay Focused on Your Goals! 🎯',
            html: `
                <h2>Motivation Boost</h2>
                <p>Hi ${userName},</p>
                <p>${message}</p>
                <p>Remember why you started this journey. Every study session brings you closer to your dreams.</p>
                <p>Your AI Focus Assistant is here to support you every step of the way.</p>
                <br>
                <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Get Support</a></p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Motivational email sent to ${userEmail}`);
            return { success: true };
        } catch (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new EmailService();
