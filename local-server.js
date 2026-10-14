/**
 * Servidor Local Autónomo para CotizaFácil Pro
 * Funciona 100% offline sin necesidad de conexión a internet ni dependencias externas.
 * Utiliza únicamente las librerías nativas de Node.js (http, fs, path).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.zip': 'application/zip',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  // CORS & Security headers for offline local usage
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse URL safely
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // If root requested, serve index.html
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Resolve file path within dist
  let filePath = path.join(DIST_DIR, pathname);

  // Check if requested file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for SPA routing or direct zip download check
      if (pathname.endsWith('.zip')) {
        const rootZipPath = path.join(__dirname, pathname.replace(/^\//, ''));
        if (fs.existsSync(rootZipPath)) {
          serveStaticFile(rootZipPath, res);
          return;
        }
      }

      // Default fallback to index.html (SPA)
      filePath = path.join(DIST_DIR, 'index.html');
    }

    serveStaticFile(filePath, res);
  });
});

function serveStaticFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Archivo no encontrado. Asegúrate de que la carpeta "dist" exista.');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Error del servidor: ${err.code}`);
      }
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    res.end(content);
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log('        COTIZAFÁCIL PRO - SISTEMA LOCAL SIN INTERNET           ');
  console.log('================================================================');
  console.log(`\n  >> Servidor activo exitosamente.`);
  console.log(`  >> Abre tu navegador web en:`);
  console.log(`\n       http://localhost:${PORT}`);
  console.log(`       http://127.0.0.1:${PORT}`);
  console.log(`\n  >> Usuarios iniciales incluidos:`);
  console.log(`     - Administrador:  usuario: admin        contraseña: admin123`);
  console.log(`     - Comercial:      usuario: comercial    contraseña: admin123`);
  console.log(`\n  >> Base de datos preconfigurada disponible en:`);
  console.log(`     - database/backup_completo_inicial.json`);
  console.log(`\n  Presiona Ctrl+C en esta ventana para detener el servidor.`);
  console.log('================================================================\n');
});
