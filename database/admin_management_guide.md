# Admin Management Guide

## Quick Access
Visit: `http://localhost/eduvault/backend/api/manage_admin.php`

This script provides a web interface to manage admin accounts.

---

## Methods to Manage Admins

### Method 1: Using the Web Interface (Easiest)
Access `manage_admin.php` in your browser for a GUI to:
- Create new admins
- Promote existing users to admin
- Change admin passwords
- Delete admin accounts

---

### Method 2: Using SQL (phpMyAdmin)

#### Create New Admin
```sql
INSERT INTO admins (name, email, password) 
VALUES (
    'Admin Name', 
    'admin@example.com', 
    '$2y$10$YourHashedPasswordHere'
);
```

To generate password hash, create a PHP file with:
```php
<?php echo password_hash('your-password', PASSWORD_DEFAULT); ?>
```

#### Promote Existing User to Admin
```sql
-- Step 1: Get user's password hash from users table
SELECT password FROM users WHERE email = 'user@example.com';

-- Step 2: Insert into admins table with same password hash
INSERT INTO admins (name, email, password)
SELECT name, email, password FROM users WHERE email = 'user@example.com';

-- Step 3: Update user role (optional - for reference)
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

#### Change Admin Password
```sql
-- First generate hash in PHP: password_hash('new-password', PASSWORD_DEFAULT)
UPDATE admins 
SET password = '$2y$10$NewHashedPasswordHere' 
WHERE email = 'admin@example.com';
```

#### Delete Admin Account
```sql
DELETE FROM admins WHERE email = 'admin@example.com';
```

---

### Method 3: Using PHP Command Line

```php
<?php
require_once 'connect.php';

// Create admin
$name = 'New Admin';
$email = 'admin@example.com';
$password = password_hash('admin123', PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO admins (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param('sss', $name, $email, $password);
$stmt->execute();

echo "Admin created!\n";
?>
```

---

## Important Notes

1. **Security**: Delete `manage_admin.php` in production or add authentication
2. **Password Hashing**: Always use `password_hash()` - never store plain passwords
3. **Dual Admin System**: 
   - Admins can login via dedicated `admins` table
   - Users with `role='admin'` in `users` table are just regular users with admin role flag
   - For admin login functionality, use the `admins` table
4. **Promoting Users**: When promoting a user, they're copied to `admins` table and can login as admin

---

## Quick Reference

**Default Admin (from setup):**
- Email: `admin@eduvault.com`
- Password: `admin123`
- Change this immediately in production!

**Access URLs:**
- Setup: `http://localhost/eduvault/backend/api/setup_admin.php`
- Manage: `http://localhost/eduvault/backend/api/manage_admin.php`

