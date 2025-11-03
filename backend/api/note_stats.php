<?php
require_once __DIR__ . '/connect.php';

require_auth();
$note_id = $_GET['note_id'] ?? null;

if (!$note_id) {
    respond_json(['error' => 'Note ID is required'], 400);
}

$stmt = $conn->prepare("SELECT id FROM notes WHERE id = ?");
$stmt->bind_param('i', $note_id);
$stmt->execute();
if ($stmt->get_result()->num_rows === 0) {
    respond_json(['error' => 'Note not found'], 404);
}

// Get stats
$downloads = $conn->query("SELECT downloads FROM notes WHERE id = $note_id")->fetch_assoc()['downloads'] ?? 0;
$likes = $conn->query("SELECT likes FROM notes WHERE id = $note_id")->fetch_assoc()['likes'] ?? 0;
$saves = $conn->query("SELECT COUNT(*) as count FROM saved_notes WHERE note_id = $note_id")->fetch_assoc()['count'];
$viewCount = $conn->query("SELECT COUNT(DISTINCT user_id) as count FROM saved_notes WHERE note_id = $note_id")->fetch_assoc()['count'];

respond_json([
    'note_id' => (int)$note_id,
    'downloads' => (int)$downloads,
    'likes' => (int)$likes,
    'saves' => (int)$saves,
    'views' => (int)$viewCount
]);
?>

