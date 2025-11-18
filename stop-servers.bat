@echo off
echo ========================================
echo Stopping AgriFinAI Servers
echo ========================================

pm2 stop all
pm2 delete all

echo.
echo Servers stopped successfully!
echo ========================================

pause
