@echo off
echo ========================================
echo Starting AgriFinAI Servers with PM2
echo ========================================

REM Stop any existing PM2 processes
echo Stopping existing processes...
pm2 stop all
pm2 delete all

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

REM Start servers using PM2
echo Starting backend and frontend servers...
pm2 start ecosystem.config.js

REM Show status
echo.
echo ========================================
echo Server Status:
echo ========================================
pm2 status

echo.
echo ========================================
echo Servers are now running!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo To view logs: pm2 logs
echo To stop servers: pm2 stop all
echo To restart servers: pm2 restart all
echo ========================================

pause
