@echo off
title ZERO CINEMA — Portable Desktop Studio
cd /d "%~dp0"
echo ===================================================
echo   ZERO CINEMA - MONOCHROME DIRECTORS STUDIO (V20.8)
echo   Launching Portable Desktop Native Window...
echo ===================================================
python app_desktop.py
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to start. Please ensure Python is installed.
    pause
)
