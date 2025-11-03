-- Dashboard Features Migration Script (Simplified - No IF NOT EXISTS)
-- Copy and paste these queries ONE BY ONE into phpMyAdmin SQL tab
-- Make sure you have selected the 'eduvault' database

-- Step 1: Add profile fields to users table
ALTER TABLE users ADD COLUMN institution VARCHAR(255) NULL AFTER email;

ALTER TABLE users ADD COLUMN bio TEXT NULL AFTER institution;

-- Step 2: Add likes column to notes table
ALTER TABLE notes ADD COLUMN likes INT DEFAULT 0 AFTER downloads;

-- Step 3: Create saved_notes table
CREATE TABLE saved_notes (
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

-- Step 4: Create liked_notes table
CREATE TABLE liked_notes (
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

