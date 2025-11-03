<?php
require_once __DIR__ . '/connect.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
    $q = isset($_GET['q']) ? trim($_GET['q']) : '';
    $subject = isset($_GET['subject']) ? trim($_GET['subject']) : '';
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    try {
        if ($id > 0) {
            $sql = "SELECT n.*, u.name as uploader_name, 
                    COALESCE(n.likes, 0) as likes,
                    ((SELECT COUNT(*) FROM saved_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_saved_notes WHERE note_id = n.id)) as save_count
                    FROM notes n 
                    LEFT JOIN users u ON n.user_id = u.id 
                    WHERE n.id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $res = $stmt->get_result()->fetch_assoc();
            if (!$res) respond_json(['error' => 'Not found'], 404);
            respond_json($res);
        }

        // Show all notes to everyone (users can browse all, but can only edit/delete their own)
        // Admins can edit/delete all notes
        $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
        
        $sql = "SELECT n.*, u.name as uploader_name,
                COALESCE(n.likes, 0) as likes,
                ((SELECT COUNT(*) FROM saved_notes WHERE note_id = n.id) + (SELECT COUNT(*) FROM admin_saved_notes WHERE note_id = n.id)) as save_count
                FROM notes n 
                LEFT JOIN users u ON n.user_id = u.id 
                WHERE 1=1";
        $params = [];
        $types = '';

        if ($q !== '') {
            $sql .= " AND (n.title LIKE ? OR n.description LIKE ? OR n.subject LIKE ?)";
            $like = '%' . $q . '%';
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
            $types .= 'sss';
        }
        if ($subject !== '') {
            $sql .= " AND n.subject = ?";
            $params[] = $subject;
            $types .= 's';
        }

        $sql .= " ORDER BY n.uploaded_at DESC";
        $stmt = $conn->prepare($sql);
        if ($types !== '' && !empty($params)) {
            $bindParams = array_merge([$types], $params);
            // Create references for bind_param
            $refs = [];
            foreach ($bindParams as $key => $value) {
                $refs[$key] = &$bindParams[$key];
            }
            call_user_func_array([$stmt, 'bind_param'], $refs);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $rows = [];
        while ($row = $result->fetch_assoc()) { $rows[] = $row; }
        respond_json($rows);
    } catch (Exception $e) {
        error_log('Fetch error: ' . $e->getMessage());
        respond_json(['error' => 'Database error', 'details' => $e->getMessage()], 500);
    } catch (Error $e) {
        error_log('Fetch fatal error: ' . $e->getMessage());
        respond_json(['error' => 'Server error', 'details' => $e->getMessage()], 500);
    }
}

respond_json(['error' => 'Invalid request method'], 405);

?>




