-- /metlife-TEN-Hackathon/backend/src/config/migrations/002_user_profiles.sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS learning_style VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS study_goals TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_study_times TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS language_preference VARCHAR(10) DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "study_reminders": true}';
