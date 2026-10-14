# Guía de Instalación y Ejecución Local Offline - CotizaFácil Pro

Esta aplicación está completamente preparada para ejecutarse en tu computadora **sin requerir conexión a internet**. Todos los archivos JavaScript, estilos, iconos de Lucide, fuentes, motor de generación de PDF e imágenes están incluidos de forma autónoma.

---

## 🚀 Cómo Iniciar la Aplicación en 1 Clic

### En Windows:
1. Haz doble clic en el archivo **`INICIAR_LOCAL.bat`**.
2. Tu navegador abrirá automáticamente: `http://localhost:3000`.

### En macOS o Linux:
1. Abre tu terminal en esta carpeta.
2. Ejecuta:
   ```bash
   ./iniciar_local.sh
   ```
3. Tu navegador abrirá automáticamente: `http://localhost:3000`.

---

## 🛠️ Métodos de Ejecución Manuales Alternativos

Si prefieres ejecutar el servidor manualmente desde una terminal o consola de comandos:

### Método 1: Con Node.js (Recomendado - Cero dependencias npm)
No necesitas ejecutar `npm install` para correrlo en producción. Simplemente ejecuta:
```bash
node local-server.js
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

### Método 2: Con Python 3
Si tienes Python instalado:
```bash
python3 -m http.server 3000 --directory dist
```
o en Windows:
```cmd
python -m http.server 3000 --directory dist
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

### Método 3: Con Node.js & Vite (Modo Desarrollador)
Si cuentas con conexión temporal o ya tienes dependencias:
```bash
npm install
npm run dev
```

---

## 👥 Cuentas de Acceso y Usuarios Incluidos

El sistema cuenta con aislamiento comercial y perfiles precargados:

| Rol | Usuario | Contraseña | Capacidades |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `admin123` | Control total, alta/baja de usuarios comerciales, permisos granulares y respaldos globales |
| **Comercial (Por Defecto)** | `comercial` | `admin123` | Emisión de cotizaciones, clientes, catálogo y descuentos hasta el 20% |
| **Comercial (Asesora)** | `maria.asesora` | `maria123` | Cotizaciones y cartera de clientes propia, descuentos hasta el 15% |

*(Puedes cambiar las contraseñas o crear nuevos usuarios comerciales en cualquier momento desde el menú "Usuarios").*

---

## 💾 Bases de Datos Incluidas y Cómo Restaurarlas

En la carpeta **`database/`** encontrarás los siguientes archivos con información de ejemplo lista para usar:

1. **`database/backup_completo_inicial.json`**: Respaldo integral compatible con el sistema.
2. **`database/usuarios.json`**: Listado de usuarios iniciales.
3. **`database/cotizaciones.json`**: Cotizaciones de ejemplo con estados (Aprobada, Enviada, etc.).
4. **`database/clientes.json`**: Cartera de clientes de prueba.
5. **`database/productos.json`**: Catálogo de servicios y productos con precios e impuestos.
6. **`database/configuracion_empresa.json`**: Configuración de marca, logotipos, colores e IVA.
7. **`database/schema_database.md`**: Explicación técnica de todos los modelos y llaves.

### ¿Cómo cargar la base de datos en la aplicación?
1. Inicia sesión como **admin** (`admin` / `admin123`).
2. Ve al menú lateral **Configuración** y selecciona la pestaña **Respaldo**.
3. Haz clic en **Cargar Archivo de Respaldo**.
4. Selecciona el archivo `database/backup_completo_inicial.json`.
5. Selecciona **"Restauración Global del Sistema"** y ¡listo! Todos los datos y catálogos quedarán cargados de inmediato.

---

## 🔒 Privacidad y Almacenamiento Local

- Toda la información generada (nuevas cotizaciones, clientes, productos, usuarios) se almacena de forma segura y permanente en el almacenamiento local del navegador (`localStorage`) de tu propia computadora.
- **No se envía ningún dato a servidores externos.**
- Para respaldar tus cotizaciones o transferirlas a otra computadora, ve a **Configuración > Respaldo > Descargar Respaldo Completo (.json)**.
