<?php
require_once __DIR__ . '/connect.php';

// Session is already started in connect.php
// Turn off display_errors to prevent output before JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond_json(['error' => 'Invalid request method'], 405);
}

// Ensure users table exists
$createUsersTable = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$conn->query($createUsersTable);

$data = json_decode(file_get_contents('php://input'), true);
error_log("Registration data received: " . print_r($data, true));

$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if ($name === '' || $email === '' || $password === '') {
    respond_json(['error' => 'Name, email, and password are required'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond_json(['error' => 'Invalid email format'], 400);
}

if (strlen($password) < 6) {
    respond_json(['error' => 'Password must be at least 6 characters'], 400);
}

try {
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        respond_json(['error' => 'Email already registered'], 409);
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $name, $email, $hashedPassword);
    $stmt->execute();
    $userId = $stmt->insert_id;

    // Get user role (default is 'user')
    $stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $userData = $stmt->get_result()->fetch_assoc();
    $userRole = $userData['role'] ?? 'user';

    // Start session
    session_start();
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = $userRole;

    respond_json([
        'success' => true,
        'message' => 'Registration successful',
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => $userRole
        ]
    ]);
} catch (Exception $e) {
    error_log('Registration error: ' . $e->getMessage());
    respond_json(['error' => 'Registration failed', 'details' => $e->getMessage()], 500);
}

