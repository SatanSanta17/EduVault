<?php
require_once __DIR__ . '/connect.php';

require_auth();
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("
    SELECT n.*, 
           (SELECT COUNT(*) FROM saved_notes WHERE note_id = n.id) as save_count,
           (SELECT COUNT(*) FROM liked_notes WHERE note_id = n.id) as like_count
    FROM notes n 
    WHERE n.user_id = ? 
    ORDER BY n.uploaded_at DESC
");
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$notes = [];

while ($row = $result->fetch_assoc()) {
    $notes[] = $row;
}

respond_json($notes);
?>

