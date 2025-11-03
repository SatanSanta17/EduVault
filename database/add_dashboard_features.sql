-- Add dashboard features to existing database
-- Run this after the main eduvault.sql schema

USE eduvault;

-- Add profile fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS institution VARCHAR(255) NULL AFTER email,
ADD COLUMN IF NOT EXISTS bio TEXT NULL AFTER institution;

-- Create saved_notes table (users can save notes for later)
CREATE TABLE IF NOT EXISTS saved_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    note_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_saved (user_id, note_id),
    INDEX idx_saved_user (user_id),
    INDEX idx_saved_note (note_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create liked_notes table (users can like notes)
CREATE TABLE IF NOT EXISTS liked_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    note_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_liked (user_id, note_id),
    INDEX idx_liked_user (user_id),
    INDEX idx_liked_note (note_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add likes count to notes table
ALTER TABLE notes
ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0 AFTER downloads;

