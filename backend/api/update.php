<?php
require_once __DIR__ . '/connect.php';

// Require authentication
require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    respond_json(['error' => 'Invalid request method'], 405);
}

// Support form-data (POST) or JSON (PUT)
$input = $_SERVER['REQUEST_METHOD'] === 'PUT' ? json_decode(file_get_contents('php://input'), true) : $_POST;

$id = isset($input['id']) ? intval($input['id']) : 0;
if ($id <= 0) respond_json(['error' => 'Invalid note id'], 400);

// Check if user can modify this note (ownership or admin)
can_modify_note($conn, $id);

$title = isset($input['title']) ? trim($input['title']) : null;
$description = array_key_exists('description', $input) ? trim((string)$input['description']) : null;
$subject = isset($input['subject']) ? trim($input['subject']) : null;

// Fetch current row
$stmt = $conn->prepare("SELECT * FROM notes WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$note = $stmt->get_result()->fetch_assoc();
if (!$note) respond_json(['error' => 'Not found'], 404);

$newFilename = $note['filename'];

// If file provided via multipart form-data, replace it
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $uploadsDir = realpath(__DIR__ . '/..') . DIRECTORY_SEPARATOR . 'uploads';
    if (!is_dir($uploadsDir)) { mkdir($uploadsDir, 0775, true); }

    $file = $_FILES['file'];
    $originalName = sanitize_filename(pathinfo($file['name'], PATHINFO_FILENAME));
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'zip', 'rar'];
    if (!in_array($ext, $allowed)) {
        respond_json(['error' => 'Unsupported file type'], 400);
    }
    $storedName = $originalName . '_' . time() . '.' . $ext;
    $destPath = $uploadsDir . DIRECTORY_SEPARATOR . $storedName;
    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        respond_json(['error' => 'Failed to save file'], 500);
    }
    // delete old file
    $oldPath = $uploadsDir . DIRECTORY_SEPARATOR . $note['filename'];
    if (is_file($oldPath)) { @unlink($oldPath); }
    $newFilename = $storedName;
}

// Build dynamic update
$fields = [];
$types = '';
$values = [];

if ($title !== null) { $fields[] = 'title = ?'; $types .= 's'; $values[] = $title; }
if ($description !== null) { $fields[] = 'description = ?'; $types .= 's'; $values[] = $description; }
if ($subject !== null) { $fields[] = 'subject = ?'; $types .= 's'; $values[] = $subject; }
if ($newFilename !== $note['filename']) { $fields[] = 'filename = ?'; $types .= 's'; $values[] = $newFilename; }

if (empty($fields)) {
    respond_json(['message' => 'No changes'], 200);
}

$sql = 'UPDATE notes SET ' . implode(', ', $fields) . ' WHERE id = ?';
$types .= 'i';
$values[] = $id;

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$values);
$stmt->execute();

respond_json(['message' => 'Updated successfully']);

?>






