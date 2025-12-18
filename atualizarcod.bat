@echo off
echo ==========================================
echo       ATUALIZANDO SISTEMA FUP...
echo ==========================================
echo.

git add .
git commit -m "Update: UI Blue Light Style - %date% %time%"
git push origin main

echo.
echo ==========================================
echo       SUCESSO! REPOSITORIO ATUALIZADO.
echo ==========================================
pause