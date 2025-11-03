<?php
require_once __DIR__ . '/connect.php';

// Session is already started in connect.php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond_json(['error' => 'Invalid request method'], 405);
}

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
    // Check if admins table exists
    $tableCheck = $conn->query("SHOW TABLES LIKE 'admins'");
    if (!$tableCheck || $tableCheck->num_rows === 0) {
        respond_json(['error' => 'Admin system not initialized. Please import the database schema.'], 404);
    }

    // Check admin login
    $admin = check_admin_login($conn, $email, $password);
    
    if ($admin) {
        $_SESSION['user_id'] = $admin['id'];
        $_SESSION['user_name'] = $admin['name'];
        $_SESSION['user_email'] = $admin['email'];
        $_SESSION['user_role'] = 'admin';
        $_SESSION['user_type'] = 'admin'; // Distinguish from regular users
        
        respond_json([
            'success' => true,
            'user' => [
                'id' => $admin['id'],
                'name' => $admin['name'],
                'email' => $admin['email'],
                'role' => 'admin',
                'type' => 'admin'
            ]
        ]);
    } else {
        // Check if admin exists but password is wrong
        $stmt = $conn->prepare("SELECT id, email FROM admins WHERE email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            respond_json(['error' => 'Invalid password. Please check your admin password.'], 401);
        } else {
            respond_json(['error' => 'Admin account not found. Email: ' . $email], 401);
        }
    }
} catch (Exception $e) {
    error_log('Admin login error: ' . $e->getMessage());
    respond_json(['error' => 'Login failed', 'details' => $e->getMessage()], 500);
}
?>

