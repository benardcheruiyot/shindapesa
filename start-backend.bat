@echo off
echo Starting ShindaPesa Backend Server...
echo.
cd /d "%~dp0backend"
echo Backend Directory: %CD%
echo.
echo Starting server on port 3000...
node index.js
