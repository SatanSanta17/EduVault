<?php
require_once __DIR__ . '/connect.php';

session_start();
session_destroy();

respond_json(['success' => true, 'message' => 'Logged out successfully']);
?>

