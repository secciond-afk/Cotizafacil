@echo off
TITLE CotizaFacil Pro - Servidor Local Offline
COLOR 0B

echo ================================================================
echo           COTIZAFACIL PRO - INICIALIZADOR LOCAL OFFLINE
echo ================================================================
echo.
echo Iniciando el sistema de cotizaciones en tu maquina local...
echo No se requiere conexion a internet.
echo.

:: 1. Comprobar Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js detectado. Iniciando servidor local en el puerto 3000...
    start http://localhost:3000
    node local-server.js
    goto end
)

:: 2. Comprobar Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python detectado. Iniciando servidor local con Python...
    start http://localhost:3000
    python -m http.server 3000 --directory dist
    goto end
)

where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python 3 detectado. Iniciando servidor local...
    start http://localhost:3000
    python3 -m http.server 3000 --directory dist
    goto end
)

echo [AVISO] No se detecto Node.js ni Python instalado en el sistema.
echo Puedes instalar Node.js desde https://nodejs.org/ o ejecutar
echo un servidor local ligero para abrir la carpeta "dist".
pause

:end
