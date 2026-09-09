@echo off
title Sobuj Enterprise Frontend Installer
color 0A
cd /d "%~dp0"

echo ========================================================
echo   Sobuj Enterprise - Frontend Automated Dependency Fix
echo ========================================================
echo.

echo [1/3] Setting Node.js memory limit to 4096MB...
set NODE_OPTIONS=--max-old-space-size=4096

echo [2/3] Cleaning corrupted npm cache...
call npm cache clean --force

echo [3/3] Installing Angular packages (Clean install)...
call npm install

echo.
echo ========================================================
echo   Installation completed successfully!
echo   Starting Angular Live Server (ng serve)...
echo ========================================================
echo.
call npm start

pause

