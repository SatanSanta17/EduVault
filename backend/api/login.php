<?php
require_once __DIR__ . '/connect.php';

// Session is already started in connect.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
error_log("Login attempt received for email: " . ($email ?? 'not set'));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond_json(['error' => 'Invalid request method'], 405);
}

// Add after the session_start()
header('Content-Type: application/json');

$data = [];
$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
// Accept application/json with or without charset parameter
if (stripos($contentType, 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input'), true);
} else {
    $data = $_POST;
}

$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if ($email === '' || $password === '') {
    respond_json(['error' => 'Email and password are required'], 400);
}

try {
    // Check if users table exists, create if not
    $tableCheck = $conn->query("SHOW TABLES LIKE 'users'");
    if (!$tableCheck || $tableCheck->num_rows === 0) {
        respond_json(['error' => 'Please register first'], 404);
    }

    // Get user including role
    $stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

 if (!$user) {
    respond_json(['error' => 'Email not found'], 404);
 }

 if ($user && password_verify($password, $user['password'])) {
    $userRole = $user['role'] ?? 'user';
    
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $userRole;
    $_SESSION['user_type'] = 'user'; // Distinguish from admin
    
    respond_json([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $userRole,
            'type' => 'user'
        ]
    ]);
 } else {
    respond_json(['error' => 'Invalid email or password'], 401);
 }
}

catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    respond_json(['error' => 'Login failed', 'details' => $e->getMessage()], 500);
}
?>

