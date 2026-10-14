# CotizaFácil Pro - Versión Offline Autónoma

Sistema profesional de emisión de cotizaciones comerciales, gestión de clientes, catálogo de productos y exportación PDF/impresión.

## Ejecución Rápida
- **Windows**: Doble clic en `INICIAR_LOCAL.bat`
- **Mac/Linux**: Ejecutar `./iniciar_local.sh`
- **Node.js**: `node local-server.js` (Abre en http://localhost:3000)
- **Python**: `python3 -m http.server 3000 --directory dist`

## Usuarios y Contraseñas
- **Admin**: `admin` / `admin123`
- **Comercial (por defecto)**: `comercial` / `admin123`
- **Comercial 2**: `maria.asesora` / `maria123`

## Base de Datos
- Ubicación: Carpeta `database/`
- Para restaurar datos: Entrar como admin -> Configuración -> Respaldo -> Cargar `database/backup_completo_inicial.json`
