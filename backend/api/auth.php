<?php
require_once __DIR__ . '/connect.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    respond_json(['authenticated' => false], 401);
}

respond_json([
    'authenticated' => true,
    'user' => [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'],
        'email' => $_SESSION['user_email'],
        'role' => $_SESSION['user_role'] ?? 'user'
    ]
]);
?>

