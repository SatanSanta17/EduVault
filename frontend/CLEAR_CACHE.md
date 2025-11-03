# Quick Fix Steps

If npm start is stuck, try these in order:

1. **Stop the process**: Press `Ctrl+C` in terminal

2. **Clear cache and restart**:
   ```bash
   cd frontend
   rm -rf node_modules/.cache
   npm start
   ```

3. **If still stuck, delete cache folder**:
   ```bash
   cd frontend
   rmdir /s /q node_modules\.cache
   npm start
   ```

4. **Check if port 3000 is in use**:
   ```bash
   netstat -ano | findstr :3000
   ```
   If something is using it, kill that process or use a different port:
   ```bash
   set PORT=3001 && npm start
   ```

5. **Nuclear option - reinstall node_modules**:
   ```bash
   cd frontend
   rmdir /s /q node_modules
   npm install
   npm start
   ```

