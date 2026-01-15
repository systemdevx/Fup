@echo off
chcp 65001 >nul
color 0A
cls

echo ========================================================
echo        SINCRONIZADOR GITHUB RAPIDO (AUTO)
echo ========================================================
echo.

:: 1. Verifica se esta na pasta correta
if not exist ".git" (
    color 0C
    echo [ERRO] O arquivo nao esta na pasta correta do projeto!
    pause
    exit
)

:: 2. Atualiza antes de enviar
echo [1/3] Buscando atualizacoes...
git pull origin main
if %errorlevel% neq 0 ( git pull origin master )
echo.

:: 3. Adiciona e Salva (Com mensagem automatica de Data/Hora)
echo [2/3] Salvando alteracoes...
git add .

:: Pega data e hora para criar uma mensagem unica
set data=%date%
set hora=%time%
git commit -m "Auto-Update: %data% as %hora%"
echo.

:: 4. Envia
echo [3/3] Enviando para o GitHub...
git push origin main
if %errorlevel% neq 0 ( git push origin master )

echo.
echo ========================================================
echo                 ENVIADO COM SUCESSO!
echo ========================================================
:: O pause abaixo serve para voce ver se deu erro ou sucesso.
:: Se quiser que feche sozinho, apague a linha abaixo.
pause