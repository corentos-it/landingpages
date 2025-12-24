@echo off
echo ========================================
echo   corentos Vorschau - WebServer stoppen
echo ========================================
echo.
echo Beende Python HTTP Server...
echo.
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *http.server*" 2>nul
if %errorLevel%==0 (
    echo Python Server beendet.
) else (
    echo Kein Python Server gefunden. Versuche ueber Port...
    powershell -Command "Get-NetTCPConnection -LocalPort 8082 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { $p = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue; if ($p.ProcessName -eq 'python') { Write-Host ('Beende: python (PID: ' + $_.OwningProcess + ')'); Stop-Process -Id $_.OwningProcess -Force } }"
)
echo.
echo Fertig.
echo.
pause
