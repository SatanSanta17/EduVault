<?php
// One-time script to create admin account with proper password hash
// Access via: http://localhost/eduvault/backend/api/setup_admin.php
// After creating admin, delete this file for security

require_once __DIR__ . '/connect.php';

header('Content-Type: text/html; charset=utf-8');

$adminEmail = 'admin@eduvault.com';
$adminPassword = 'admin123';
$adminName = 'System Administrator';

try {
    // Check if admins table exists
    $tableCheck = $conn->query("SHOW TABLES LIKE 'admins'");
    if (!$tableCheck || $tableCheck->num_rows === 0) {
        die("Error: Admins table does not exist. Please import the database schema first.");
    }

    // Generate password hash
    $hashedPassword = password_hash($adminPassword, PASSWORD_DEFAULT);

    // Check if admin already exists
    $stmt = $conn->prepare("SELECT id, email FROM admins WHERE email = ?");
    $stmt->bind_param('s', $adminEmail);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Update existing admin password
        $admin = $result->fetch_assoc();
        $updateStmt = $conn->prepare("UPDATE admins SET password = ? WHERE id = ?");
        $updateStmt->bind_param('si', $hashedPassword, $admin['id']);
        $updateStmt->execute();
        
        echo "<h2>✓ Admin account updated!</h2>";
        echo "<p><strong>Email:</strong> " . htmlspecialchars($adminEmail) . "</p>";
        echo "<p><strong>Password:</strong> " . htmlspecialchars($adminPassword) . "</p>";
        echo "<p><strong>Hash:</strong> " . htmlspecialchars($hashedPassword) . "</p>";
    } else {
        // Create new admin
        $stmt = $conn->prepare("INSERT INTO admins (name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param('sss', $adminName, $adminEmail, $hashedPassword);
        $stmt->execute();
        
        echo "<h2>✓ Admin account created!</h2>";
        echo "<p><strong>Email:</strong> " . htmlspecialchars($adminEmail) . "</p>";
        echo "<p><strong>Password:</strong> " . htmlspecialchars($adminPassword) . "</p>";
        echo "<p><strong>Hash:</strong> " . htmlspecialchars($hashedPassword) . "</p>";
    }
    
    echo "<hr>";
    echo "<p><strong>⚠️ IMPORTANT:</strong> Delete this file (setup_admin.php) after use for security!</p>";
    echo "<p>You can now login as admin with:</p>";
    echo "<ul>";
    echo "<li>Email: <strong>" . htmlspecialchars($adminEmail) . "</strong></li>";
    echo "<li>Password: <strong>" . htmlspecialchars($adminPassword) . "</strong></li>";
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<h2>✗ Error:</h2>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
}
?>

