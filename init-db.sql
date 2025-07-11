-- Initial database setup for Study Ninja
-- This script runs automatically when the PostgreSQL container starts

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create basic tables structure (can be modified by migrations later)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 60,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_image_url VARCHAR(500),
    question_type VARCHAR(50) DEFAULT 'multiple_choice',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answer_choices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    choice_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    exam_id UUID REFERENCES exams(id),
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    time_taken_seconds INTEGER
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_answer_choices_question_id ON answer_choices(question_id);
CREATE INDEX IF NOT EXISTS idx_user_exam_attempts_user_id ON user_exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exam_attempts_exam_id ON user_exam_attempts(exam_id);

-- Insert sample data for development
INSERT INTO users (email, name, role) VALUES 
('admin@studyninja.com', 'Admin User', 'admin'),
('test@studyninja.com', 'Test User', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample exam
INSERT INTO exams (title, description, duration_minutes, created_by) VALUES 
('Sample Math Exam', 'A sample mathematics exam for elementary school preparation', 30, 
 (SELECT id FROM users WHERE email = 'admin@studyninja.com' LIMIT 1))
ON CONFLICT DO NOTHING;