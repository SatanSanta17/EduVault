<?php
require_once __DIR__ . '/connect.php';

// Require authentication
require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond_json(['error' => 'Invalid request method'], 405);
}

// Support id via query or body
$id = 0;
if (isset($_GET['id'])) { $id = intval($_GET['id']); }
if ($id === 0 && isset($_POST['id'])) { $id = intval($_POST['id']); }
if ($id === 0) {
    $body = json_decode(file_get_contents('php://input'), true);
    if ($body && isset($body['id'])) $id = intval($body['id']);
}

if ($id <= 0) respond_json(['error' => 'Invalid note id'], 400);

// Check if user can modify this note (ownership or admin)
can_modify_note($conn, $id);

// Get note
$stmt = $conn->prepare('SELECT filename FROM notes WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$note = $stmt->get_result()->fetch_assoc();
if (!$note) respond_json(['error' => 'Not found'], 404);

// Delete row
$stmt = $conn->prepare('DELETE FROM notes WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();

// Delete file
$uploadsDir = realpath(__DIR__ . '/..') . DIRECTORY_SEPARATOR . 'uploads';
$path = $uploadsDir . DIRECTORY_SEPARATOR . $note['filename'];
if (is_file($path)) { @unlink($path); }

respond_json(['message' => 'Deleted successfully']);

?>







