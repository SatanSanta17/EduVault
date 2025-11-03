# EduVault – Student Notes Sharing (React + PHP + MySQL)

EduVault is a simple full-stack app for uploading, browsing, searching, downloading, editing, and deleting study notes.

## Stack
- Frontend: React (Hooks, Router, Tailwind via CDN)
- Backend: PHP (REST-style endpoints)
- DB: MySQL (phpMyAdmin)
- Server: XAMPP/LAMP (localhost)

## Project Structure
```
frontend/
backend/
  api/
  uploads/
database/eduvault.sql
```

## 1) Database Setup
1. Open phpMyAdmin.
2. Import `database/eduvault.sql` (it creates `eduvault` DB and `notes` table).

## 2) Backend Setup (XAMPP/LAMP)
1. Copy the project to your web root. For XAMPP on Windows:
   - Move the `backend` folder (and keep `uploads/` inside it) under:
     `C:/xampp/htdocs/eduvault/backend`
   - Final API path should be: `http://localhost/eduvault/backend/api`
2. Ensure `backend/uploads/` is writable by PHP.
3. If your MySQL credentials differ, update `backend/api/connect.php`:
   - `$DB_HOST`, `$DB_USER`, `$DB_PASS`, `$DB_NAME`
4. Start Apache and MySQL from XAMPP control panel.

## 3) Frontend Setup (React)
1. Open a terminal in `frontend/`.
2. Install deps:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm start
   ```
4. App runs at `http://localhost:3000`.

If you use a different backend path, update `frontend/src/services/api.js`:
```js
export const API_BASE = 'http://localhost/eduvault/backend/api';
```

## API Endpoints (PHP)
- `POST /upload.php` — form-data: `title`, `description`, `subject`, `file`
- `GET /fetch.php` — list notes; query: `q`, `subject`
- `GET /fetch.php?id=:id` — get one note
- `POST /update.php` — form-data: `id`, `title?`, `description?`, `subject?`, `file?`
- `DELETE /delete.php?id=:id` — delete note
- `GET /download.php?id=:id` — download file (increments `downloads`)
- `GET /popular.php?limit=5` — top downloads

## Usage Tips
- Allowed file extensions: pdf, doc, docx, ppt, pptx, txt, zip, rar
- CORS is enabled for `http://localhost:3000` in `connect.php`.
- If downloads return JSON instead of a file, visit the URL directly to test or ensure your browser/devtools isn’t blocking the response.

## Troubleshooting
- 500 errors: check `connect.php` DB credentials and that the DB exists.
- 404 on API: verify folder is under `htdocs/eduvault/backend/api`.
- Cannot upload: ensure `backend/uploads/` exists and is writable.
- CORS issues: confirm frontend runs at `http://localhost:3000` or adjust `Access-Control-Allow-Origin` in `connect.php`.

## License
MIT

