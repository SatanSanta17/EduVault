<?php
require_once __DIR__ . '/connect.php';

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 5;
if ($limit <= 0 || $limit > 50) { $limit = 5; }

try {
    // Show all popular notes (users can browse all, but can only edit/delete their own)
    $sql = "SELECT n.*, u.name as uploader_name,
            COALESCE(n.likes, 0) as likes,
            ((SELECT COUNT(*) FROM saved_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_saved_notes WHERE note_id = n.id)) as save_count
            FROM notes n 
            LEFT JOIN users u ON n.user_id = u.id 
            ORDER BY n.downloads DESC, n.uploaded_at DESC LIMIT ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) { $rows[] = $row; }
    respond_json($rows);
} catch (Exception $e) {
    respond_json(['error' => 'Database error', 'details' => $e->getMessage()], 500);
}

?>







