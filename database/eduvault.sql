-- EduVault Database Schema
-- Create database and tables

CREATE DATABASE IF NOT EXISTS eduvault;
USE eduvault;

-- Create users table first (notes table references it)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create admins table (dedicated table for administrators)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notes table (references users table)
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  downloads INT DEFAULT 0,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notes_subject (subject),
  INDEX idx_notes_title (title),
  INDEX idx_notes_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin account (password: admin123 - CHANGE THIS IN PRODUCTION!)
-- IMPORTANT: The hash below may not work. Use setup_admin.php script instead:
-- Access: http://localhost/eduvault/backend/api/setup_admin.php
-- This will create/update the admin account with the correct password hash
-- 
-- Or manually create admin via SQL after generating hash with PHP:
-- INSERT INTO admins (name, email, password) VALUES 
-- ('System Administrator', 'admin@eduvault.com', '$2y$10$YourGeneratedHashHere')
-- ON DUPLICATE KEY UPDATE email=email;

-- Note: Demo data INSERT statements removed - they require user_id which must reference existing users
-- To add demo data, first create a test user through the registration form, then insert notes with that user's ID
