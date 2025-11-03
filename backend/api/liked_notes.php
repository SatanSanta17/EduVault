<?php
require_once __DIR__ . '/connect.php';

require_auth();
$user_id = $_SESSION['user_id'];
$isAdmin = is_admin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get liked notes for user or admin
    if ($isAdmin) {
        $stmt = $conn->prepare("
            SELECT n.*, 
                   u.name as uploader_name,
                   ln.liked_at,
                   (SELECT COUNT(*) FROM saved_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_saved_notes WHERE note_id = n.id) as save_count,
                   (SELECT COUNT(*) FROM liked_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_liked_notes WHERE note_id = n.id) as like_count
            FROM admin_liked_notes ln
            JOIN notes n ON ln.note_id = n.id
            LEFT JOIN users u ON n.user_id = u.id
            WHERE ln.admin_id = ?
            ORDER BY ln.liked_at DESC
        ");
    } else {
        $stmt = $conn->prepare("
            SELECT n.*, 
                   u.name as uploader_name,
                   ln.liked_at,
                   (SELECT COUNT(*) FROM saved_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_saved_notes WHERE note_id = n.id) as save_count,
                   (SELECT COUNT(*) FROM liked_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_liked_notes WHERE note_id = n.id) as like_count
            FROM liked_notes ln
            JOIN notes n ON ln.note_id = n.id
            LEFT JOIN users u ON n.user_id = u.id
            WHERE ln.user_id = ?
            ORDER BY ln.liked_at DESC
        ");
    }
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $notes = [];
    
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
    
    respond_json($notes);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Like a note
    $data = json_decode(file_get_contents('php://input'), true);
    $note_id = $data['note_id'] ?? null;
    
    if (!$note_id) {
        respond_json(['error' => 'Note ID is required'], 400);
    }
    
    // Check if note exists
    $stmt = $conn->prepare("SELECT id FROM notes WHERE id = ?");
    $stmt->bind_param('i', $note_id);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        respond_json(['error' => 'Note not found'], 404);
    }
    
    // Check if already liked
    if ($isAdmin) {
        $stmt = $conn->prepare("SELECT id FROM admin_liked_notes WHERE admin_id = ? AND note_id = ?");
    } else {
        $stmt = $conn->prepare("SELECT id FROM liked_notes WHERE user_id = ? AND note_id = ?");
    }
    $stmt->bind_param('ii', $user_id, $note_id);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        respond_json(['error' => 'Note already liked'], 400);
    }
    
    // Like the note
    if ($isAdmin) {
        $stmt = $conn->prepare("INSERT INTO admin_liked_notes (admin_id, note_id) VALUES (?, ?)");
    } else {
        $stmt = $conn->prepare("INSERT INTO liked_notes (user_id, note_id) VALUES (?, ?)");
    }
    $stmt->bind_param('ii', $user_id, $note_id);
    
    if ($stmt->execute()) {
        // Update likes count
        $conn->query("UPDATE notes SET likes = likes + 1 WHERE id = $note_id");
        
        respond_json(['success' => true, 'message' => 'Note liked']);
    } else {
        respond_json(['error' => 'Failed to like note'], 500);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Unlike a note
    $note_id = $_GET['note_id'] ?? null;
    
    if (!$note_id) {
        respond_json(['error' => 'Note ID is required'], 400);
    }
    
    if ($isAdmin) {
        $stmt = $conn->prepare("DELETE FROM admin_liked_notes WHERE admin_id = ? AND note_id = ?");
    } else {
        $stmt = $conn->prepare("DELETE FROM liked_notes WHERE user_id = ? AND note_id = ?");
    }
    $stmt->bind_param('ii', $user_id, $note_id);
    
    if ($stmt->execute()) {
        // Update likes count
        $conn->query("UPDATE notes SET likes = GREATEST(likes - 1, 0) WHERE id = $note_id");
        
        respond_json(['success' => true, 'message' => 'Note unliked']);
    } else {
        respond_json(['error' => 'Failed to unlike note'], 500);
    }
} else {
    respond_json(['error' => 'Method not allowed'], 405);
}
?>

