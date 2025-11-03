<?php
require_once __DIR__ . '/connect.php';

require_auth();
$user_id = $_SESSION['user_id'];
$isAdmin = is_admin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get saved notes for user or admin
    if ($isAdmin) {
        $stmt = $conn->prepare("
            SELECT n.*, 
                   u.name as uploader_name,
                   sn.saved_at,
                   (SELECT COUNT(*) FROM saved_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_saved_notes WHERE note_id = n.id) as save_count,
                   (SELECT COUNT(*) FROM liked_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_liked_notes WHERE note_id = n.id) as like_count
            FROM admin_saved_notes sn
            JOIN notes n ON sn.note_id = n.id
            LEFT JOIN users u ON n.user_id = u.id
            WHERE sn.admin_id = ?
            ORDER BY sn.saved_at DESC
        ");
    } else {
        $stmt = $conn->prepare("
            SELECT n.*, 
                   u.name as uploader_name,
                   sn.saved_at,
                   (SELECT COUNT(*) FROM saved_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_saved_notes WHERE note_id = n.id) as save_count,
                   (SELECT COUNT(*) FROM liked_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_liked_notes WHERE note_id = n.id) as like_count
            FROM saved_notes sn
            JOIN notes n ON sn.note_id = n.id
            LEFT JOIN users u ON n.user_id = u.id
            WHERE sn.user_id = ?
            ORDER BY sn.saved_at DESC
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
    // Save a note
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
    
    // Check if already saved
    if ($isAdmin) {
        $stmt = $conn->prepare("SELECT id FROM admin_saved_notes WHERE admin_id = ? AND note_id = ?");
    } else {
        $stmt = $conn->prepare("SELECT id FROM saved_notes WHERE user_id = ? AND note_id = ?");
    }
    $stmt->bind_param('ii', $user_id, $note_id);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        respond_json(['error' => 'Note already saved'], 400);
    }
    
    // Save the note
    if ($isAdmin) {
        $stmt = $conn->prepare("INSERT INTO admin_saved_notes (admin_id, note_id) VALUES (?, ?)");
    } else {
        $stmt = $conn->prepare("INSERT INTO saved_notes (user_id, note_id) VALUES (?, ?)");
    }
    $stmt->bind_param('ii', $user_id, $note_id);
    
    if ($stmt->execute()) {
        respond_json(['success' => true, 'message' => 'Note saved']);
    } else {
        respond_json(['error' => 'Failed to save note'], 500);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Unsave a note
    $note_id = $_GET['note_id'] ?? null;
    
    if (!$note_id) {
        respond_json(['error' => 'Note ID is required'], 400);
    }
    
    if ($isAdmin) {
        $stmt = $conn->prepare("DELETE FROM admin_saved_notes WHERE admin_id = ? AND note_id = ?");
    } else {
        $stmt = $conn->prepare("DELETE FROM saved_notes WHERE user_id = ? AND note_id = ?");
    }
    $stmt->bind_param('ii', $user_id, $note_id);
    
    if ($stmt->execute()) {
        respond_json(['success' => true, 'message' => 'Note unsaved']);
    } else {
        respond_json(['error' => 'Failed to unsave note'], 500);
    }
} else {
    respond_json(['error' => 'Method not allowed'], 405);
}
?>

