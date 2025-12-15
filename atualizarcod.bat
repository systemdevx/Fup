@echo off
echo ==========================================
echo       ATUALIZANDO SEU PROJETO...
echo ==========================================
echo.

:: Adiciona os arquivos
git add .

:: Salva com uma mensagem automatica com a data e hora
git commit -m "Atualizacao automatica: %date% %time%"

:: Envia para o GitHub
git push origin main

echo.
echo ==========================================
echo       SUCESSO! TUDO ENVIADO.
echo ==========================================
pause