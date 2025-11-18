@echo off
echo ========================================
echo Restarting AgriFinAI Servers
echo ========================================

pm2 restart all

echo.
echo ========================================
echo Servers restarted successfully!
echo ========================================
pm2 status

pause
