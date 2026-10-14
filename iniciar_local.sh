#!/bin/bash

echo "================================================================"
echo "          COTIZAFÁCIL PRO - INICIALIZADOR LOCAL OFFLINE         "
echo "================================================================"
echo ""
echo "Iniciando sistema localmente sin conexión a internet..."

PORT=3000

# Function to open URL in default browser
open_browser() {
  sleep 1
  if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:${PORT}" > /dev/null 2>&1 &
  elif command -v open > /dev/null; then
    open "http://localhost:${PORT}" > /dev/null 2>&1 &
  fi
}

if command -v node > /dev/null 2>&1; then
  echo "[OK] Node.js detectado. Iniciando servidor local..."
  open_browser
  node local-server.js
elif command -v python3 > /dev/null 2>&1; then
  echo "[OK] Python 3 detectado. Iniciando servidor HTTP local en dist..."
  open_browser
  python3 -m http.server ${PORT} --directory dist
elif command -v python > /dev/null 2>&1; then
  echo "[OK] Python detectado. Iniciando servidor HTTP local en dist..."
  open_browser
  python -m http.server ${PORT} --directory dist
else
  echo "[AVISO] No se detectó Node.js ni Python en el sistema."
  echo "Por favor instala Node.js o Python para servir la carpeta dist localmente."
fi
