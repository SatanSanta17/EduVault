<?php
require_once __DIR__ . '/connect.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    respond_json(['error' => 'Invalid note id'], 400);
}

// Fetch note
$stmt = $conn->prepare('SELECT filename, title FROM notes WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$note = $stmt->get_result()->fetch_assoc();
if (!$note) {
    respond_json(['error' => 'Not found'], 404);
}

$uploadsDir = realpath(__DIR__ . '/..') . DIRECTORY_SEPARATOR . 'uploads';
$filePath = $uploadsDir . DIRECTORY_SEPARATOR . $note['filename'];
if (!is_file($filePath)) {
    respond_json(['error' => 'File missing on server'], 404);
}

// Increment download counter (best-effort, use prepared statement)
try {
    $updateStmt = $conn->prepare('UPDATE notes SET downloads = downloads + 1 WHERE id = ?');
    if ($updateStmt) {
        $updateStmt->bind_param('i', $id);
        $updateStmt->execute();
        $updateStmt->close();
    }
} catch (Exception $e) { 
    // Log error but don't stop download
    error_log('Download counter increment failed: ' . $e->getMessage());
}

// Serve file as download
$basename = basename($filePath);
$filesize = filesize($filePath);
$ctype = mime_content_type($filePath);

header('Content-Description: File Transfer');
header('Content-Type: ' . $ctype);
header('Content-Disposition: attachment; filename="' . $basename . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . $filesize);

readfile($filePath);
exit;

?>






