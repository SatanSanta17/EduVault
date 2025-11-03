<?php
require_once __DIR__ . '/connect.php';

require_auth();
$user_id = $_SESSION['user_id'];
$isAdmin = is_admin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get profile for user or admin
    if ($isAdmin) {
        $stmt = $conn->prepare("SELECT id, name, email, institution, bio, created_at FROM admins WHERE id = ?");
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $admin = $result->fetch_assoc();
        if (!$admin) {
            respond_json(['error' => 'User not found'], 404);
        }
        $user = [
            'id' => (int)$admin['id'],
            'name' => $admin['name'],
            'email' => $admin['email'],
            'institution' => $admin['institution'] ?? null,
            'bio' => $admin['bio'] ?? null,
            'role' => 'admin',
            'created_at' => $admin['created_at']
        ];
    } else {
        $stmt = $conn->prepare("SELECT id, name, email, institution, bio, role, created_at FROM users WHERE id = ?");
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        if (!$user) {
            respond_json(['error' => 'User not found'], 404);
        }
    }
    
    // Get stats
    $notesCount = $conn->query("SELECT COUNT(*) as count FROM notes WHERE user_id = $user_id")->fetch_assoc()['count'];
    $totalDownloads = $conn->query("SELECT SUM(downloads) as total FROM notes WHERE user_id = $user_id")->fetch_assoc()['total'] ?? 0;
    $totalLikes = $conn->query("SELECT SUM(likes) as total FROM notes WHERE user_id = $user_id")->fetch_assoc()['total'] ?? 0;
    $savedCount = $conn->query("SELECT COUNT(*) as count FROM saved_notes WHERE user_id = $user_id")->fetch_assoc()['count'];
    $likedCount = $conn->query("SELECT COUNT(*) as count FROM liked_notes WHERE user_id = $user_id")->fetch_assoc()['count'];
    
    respond_json([
        'user' => $user,
        'stats' => [
            'notes_shared' => (int)$notesCount,
            'total_downloads' => (int)$totalDownloads,
            'total_likes_received' => (int)$totalLikes,
            'notes_saved' => (int)$savedCount,
            'notes_liked' => (int)$likedCount
        ]
    ]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Update profile for user or admin
    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'] ?? null;
    $institution = $data['institution'] ?? null;
    $bio = $data['bio'] ?? null;

    if (!$name) {
        respond_json(['error' => 'Name is required'], 400);
    }

    if ($isAdmin) {
        $stmt = $conn->prepare("UPDATE admins SET name = ?, institution = ?, bio = ? WHERE id = ?");
        $stmt->bind_param('sssi', $name, $institution, $bio, $user_id);
        if ($stmt->execute()) {
            $stmt = $conn->prepare("SELECT id, name, email, institution, bio, created_at FROM admins WHERE id = ?");
            $stmt->bind_param('i', $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $admin = $result->fetch_assoc();
            $user = [
                'id' => (int)$admin['id'],
                'name' => $admin['name'],
                'email' => $admin['email'],
                'institution' => $admin['institution'] ?? null,
                'bio' => $admin['bio'] ?? null,
                'role' => 'admin',
                'created_at' => $admin['created_at']
            ];
            respond_json(['success' => true, 'user' => $user]);
        } else {
            respond_json(['error' => 'Failed to update profile'], 500);
        }
    } else {
        $stmt = $conn->prepare("UPDATE users SET name = ?, institution = ?, bio = ? WHERE id = ?");
        $stmt->bind_param('sssi', $name, $institution, $bio, $user_id);
        if ($stmt->execute()) {
            $stmt = $conn->prepare("SELECT id, name, email, institution, bio, role, created_at FROM users WHERE id = ?");
            $stmt->bind_param('i', $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            respond_json(['success' => true, 'user' => $user]);
        } else {
            respond_json(['error' => 'Failed to update profile'], 500);
        }
    }
} else {
    respond_json(['error' => 'Method not allowed'], 405);
}
?>

