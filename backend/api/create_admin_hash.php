<?php
// Quick script to generate password hash for admin account
// Run this once to get the correct hash, then update eduvault.sql

$password = 'admin123';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password: " . $password . "\n";
echo "Hash: " . $hash . "\n";
echo "\nUse this hash in your SQL file:\n";
echo "INSERT INTO admins (name, email, password) VALUES \n";
echo "('System Administrator', 'admin@eduvault.com', '" . $hash . "')\n";
echo "ON DUPLICATE KEY UPDATE email=email;\n";

// Verify the hash works
if (password_verify($password, $hash)) {
    echo "\n✓ Hash verification successful!\n";
} else {
    echo "\n✗ Hash verification failed!\n";
}

