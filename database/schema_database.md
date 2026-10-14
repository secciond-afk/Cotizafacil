# Estructura y Esquema de Bases de Datos de CotizaFácil Pro

Este documento describe la arquitectura de persistencia, las colecciones de datos, los permisos por rol y las llaves de almacenamiento utilizadas por **CotizaFácil Pro** para su ejecución local e independiente sin conexión a internet.

---

## 1. Arquitectura de Datos Offline

La aplicación opera 100% en el entorno local del cliente mediante:
- **Almacenamiento Local del Navegador (`localStorage`)**: Persistencia instantánea y transaccional por usuario.
- **Aislamiento Multi-Usuario y Comercial**: Las cotizaciones, clientes y productos están particionados por el identificador del usuario (`userId`). El administrador tiene visibilidad global o filtrada y puede configurar permisos específicos.
- **Exportación e Importación JSON Universales**: Archivos portables estructurados que pueden transferirse entre máquinas o respaldarse en unidades externas.

---

## 2. Llaves de Almacenamiento Local (`STORAGE_KEYS`)

| Llave LocalStorage | Descripción | Tipo |
| :--- | :--- | :--- |
| `cotizafacil_users_v2` | Colección completa de usuarios (Administradores y Comerciales) | `User[]` |
| `cotizafacil_current_user_id_v2` | ID del usuario actualmente autenticado | `string` |
| `cotizafacil_auth_status_v2` | Bandera de sesión activa | `'true' \| 'false'` |
| `cotizafacil_all_quotes_v2` | Colección de todas las cotizaciones del sistema | `Quote[]` |
| `cotizafacil_all_clients_v2` | Directorio de clientes | `Client[]` |
| `cotizafacil_all_products_v2` | Catálogo de productos y servicios con precios e IVA | `Product[]` |
| `cotizafacil_settings_v2` | Configuración global por defecto de la empresa | `CompanySettings` |
| `cotizafacil_user_settings_v2` | Diccionario de personalización gráfica por usuario | `Record<string, CompanySettings>` |
| `cotizafacil_notifications_v2` | Notificaciones y alertas de seguimiento | `NotificationItem[]` |

---

## 3. Esquemas de Entidades

### 3.1. Usuario (`User`)
```typescript
interface User {
  id: string;                     // ej. "user-admin", "user-comercial-1"
  name: string;                   // Nombre completo
  email: string;                  // Correo electrónico
  username?: string;              // Nombre de usuario para login (ej. "admin", "vendedor")
  password?: string;              // Contraseña de acceso local
  role: 'admin' | 'seller';       // Rol: Administrador o Comercial/Vendedor
  status?: 'active' | 'inactive'; // Estado de la cuenta (controlado por Admin)
  company?: string;               // Nombre de la empresa asociada
  phone?: string;                 // Teléfono de contacto
  createdAt: string;              // Fecha ISO
  permissions?: UserPermissions;  // Permisos granulares asignados
}
```

### 3.2. Permisos Granulares de Usuario Comercial (`UserPermissions`)
```typescript
interface UserPermissions {
  canManageProducts: boolean;     // Crear y editar productos en el catálogo
  canDeleteQuotes: boolean;       // Autorización para borrar cotizaciones
  canDeleteClients: boolean;      // Autorización para borrar clientes
  canGiveDiscounts: boolean;      // Permitir aplicar descuentos
  maxDiscountPercent: number;     // Porcentaje máximo de descuento autorizado (ej. 15%)
  canExportData: boolean;         // Permitir descargar respaldos JSON
}
```

### 3.3. Cotización (`Quote`)
```typescript
interface Quote {
  id: string;                     // ej. "quote-001"
  userId?: string;                // ID del usuario creador (para aislamiento comercial)
  quoteNumber: string;            // Folio consecutivo (ej. "COT-2026-001")
  clientId: string;               // Referencia al cliente
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientTaxId?: string;           // RFC / RUT / CIF / NIF
  clientAddress?: string;
  date: string;                   // Fecha de emisión (YYYY-MM-DD)
  validUntil: string;             // Fecha de vigencia (YYYY-MM-DD)
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  statusChangeDate?: string;
  statusDetails?: string;         // Motivo o comentario del cambio de estado
  followUpDate?: string;          // Fecha programada para seguimiento comercial
  followUpCompleted?: boolean;
  currency: string;               // ej. "USD", "MXN", "EUR"
  currencySymbol: string;         // ej. "$", "€"
  items: QuoteItem[];             // Líneas de detalle
  subtotal: number;
  globalDiscountPercent: number;
  discountAmount: number;
  taxRate: number;                // Porcentaje de impuesto (ej. 16)
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
  paymentMethods: string;
  createdAt: string;
  updatedAt: string;
}
```

### 3.4. Producto / Servicio (`Product`)
```typescript
interface Product {
  id: string;                     // ej. "prod-1"
  userId?: string;                // Creador
  name: string;                   // Nombre comercial
  sku: string;                    // Código de producto
  category: string;               // Categoría
  description: string;            // Descripción técnica o comercial
  unit: string;                   // Unidad (ej. "pieza", "servicio", "hora", "mes")
  unitPrice: number;              // Precio unitario base
  taxRate: number;                // Tasa de IVA aplicable
  applyTax: boolean;              // Si aplica impuesto
  discountPercent?: number;       // Descuento sugerido
  createdAt: string;
}
```

### 3.5. Cliente (`Client`)
```typescript
interface Client {
  id: string;                     // ej. "cli-1"
  userId?: string;                // Asesor asignado
  name: string;                   // Razón Social o Nombre del Cliente
  contactPerson: string;          // Persona de contacto
  taxId: string;                  // Identificador fiscal
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: string;
}
```

---

## 4. Usuarios Preconfigurados de Fábrica

| Rol | Usuario | Contraseña | Perfil |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `admin123` | Control total, administración de usuarios y respaldos globales |
| **Comercial (Por Defecto)** | `comercial` | `admin123` | Emisión de cotizaciones y cartera de clientes con permisos comerciales autorizados |
| **Comercial (Asesora)** | `maria.asesora` | `maria123` | Cotizaciones y prospectos independientes |
