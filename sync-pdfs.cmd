@echo off
setlocal
cd /d "%~dp0"

set "CODEX_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if exist "%CODEX_NODE%" (
  "%CODEX_NODE%" sync-pdfs.js
) else (
  node sync-pdfs.js
)

echo.
echo PDF sync finished. You can close this window.
pause
