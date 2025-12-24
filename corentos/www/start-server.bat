@echo off
echo ========================================
echo   corentos Vorschau - WebServer
echo ========================================
echo.
echo Server startet auf http://localhost:8082
echo Oeffne: http://localhost:8082/index.html
echo Druecke Strg+C zum Beenden
echo.
"C:\Users\ralfh\AppData\Local\Programs\Python\Python312\python.exe" -m http.server 8082
pause
