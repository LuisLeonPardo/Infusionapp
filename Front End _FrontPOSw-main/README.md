# FrontPOSw - Sistema de Inventario y Punto de Venta

## 📋 Descripción del Proyecto

FrontPOSw es una aplicación web moderna de gestión de inventario y punto de venta desarrollada con React, TypeScript y Tailwind CSS. El sistema está diseñado para pequeñas y medianas empresas que necesitan una solución completa para gestionar productos, inventario, ventas y órdenes de compra.

### 🎯 Características Principales

- **Tablero de Venta**: Interfaz intuitiva para seleccionar productos y crear órdenes de venta
- **Gestión de Inventario**: Control completo de productos, stock y categorías
- **Smart Inventory**: Sistema inteligente con OCR para procesar facturas y órdenes de compra
- **Autenticación**: Sistema de login y registro de usuarios
- **Perfil de Usuario**: Gestión completa de datos personales, seguridad y métodos de pago
- **Responsive Design**: Optimizado para desktop, tablet y móvil

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd FrontPOSw
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Acceder a la aplicación**
   - Abrir navegador en `http://localhost:5173`

### Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter de código

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── components/          # Componentes React
│   ├── HomePage.tsx     # Tablero principal de venta
│   ├── InventoryPage.tsx # Gestión de inventario
│   ├── NewProductPage.tsx # Creación de productos
│   ├── EditProductPage.tsx # Edición de productos
│   ├── SmartInventoryPage.tsx # OCR y órdenes de compra
│   ├── OCRResultPage.tsx # Resultados del procesamiento OCR
│   ├── LoginPage.tsx    # Autenticación de usuarios
│   ├── RegisterPage.tsx # Registro de usuarios
│   ├── ProfilePage.tsx  # Perfil y configuraciones
│   ├── SideMenu.tsx     # Menú lateral de navegación
│   ├── ProductCard.tsx  # Tarjeta de producto
│   ├── SalesDrawer.tsx  # Panel lateral de ventas
│   ├── PaymentScreen.tsx # Pantalla de pago
│   └── PaymentSuccessScreen.tsx # Confirmación de pago
├── App.tsx              # Componente principal y rutas
├── main.tsx            # Punto de entrada de la aplicación
├── index.css           # Estilos globales
└── vite-env.d.ts       # Tipos de Vite
```

## 📱 Componentes Detallados

### 🏠 HomePage.tsx
**Propósito**: Tablero principal de venta donde los usuarios pueden seleccionar productos para crear órdenes.

**Funcionalidades**:
- Grid responsivo de productos
- Búsqueda en tiempo real
- Filtrado de productos
- Integración con panel de ventas
- Navegación a pantalla de pago

**Props**:
- `searchTerm?: string` - Término de búsqueda externo

### 📦 InventoryPage.tsx
**Propósito**: Gestión completa del inventario de productos.

**Funcionalidades**:
- Tabla responsiva de productos
- Filtros por categoría y estado
- Búsqueda de productos
- Selección múltiple
- Navegación a edición de productos
- Estados de stock (activo/inactivo)

### ➕ NewProductPage.tsx
**Propósito**: Formulario para crear nuevos productos en el inventario.

**Funcionalidades**:
- Formulario de dos columnas
- Subida de imágenes
- Gestión de categorías
- Sistema de variantes (color, tamaño, material, etc.)
- Configuración de precios y stock
- Validación de formularios

### ✏️ EditProductPage.tsx
**Propósito**: Edición de productos existentes con datos precargados.

**Funcionalidades**:
- Formulario precargado con datos existentes
- Edición de variantes
- Actualización de stock y precios
- Eliminación de productos
- Historial de cambios

### 🧠 SmartInventoryPage.tsx
**Propósito**: Sistema inteligente para procesamiento de documentos y gestión de órdenes de compra.

**Funcionalidades**:
- **Modo Escaneo**: 
  - Subida de archivos PDF/imágenes
  - Procesamiento OCR
  - Drag & drop
- **Modo Órdenes de Compra**:
  - Gestión de órdenes de compra
  - Estados: Pendiente, Verificado, Recibido
  - Creación de nuevas órdenes
  - Edición y eliminación
  - Resumen estadístico

### 📄 OCRResultPage.tsx
**Propósito**: Muestra y permite editar los resultados del procesamiento OCR.

**Funcionalidades**:
- Tabla editable de productos detectados
- Matching con productos existentes
- Indicadores de precisión
- Selección de elementos
- Exportación a CSV
- Validación de datos

### 🔐 LoginPage.tsx
**Propósito**: Autenticación de usuarios con diseño responsivo.

**Funcionalidades**:
- Formulario de login
- Validación de campos
- Opciones de login social (Google, Facebook)
- Recuperación de contraseña
- Navegación a registro
- Diseño adaptativo (desktop/tablet/móvil)

### 📝 RegisterPage.tsx
**Propósito**: Registro de nuevos usuarios.

**Funcionalidades**:
- Formulario de registro completo
- Validación de contraseñas
- Términos y condiciones
- Campos opcionales (teléfono)
- Diseño responsivo

### 👤 ProfilePage.tsx
**Propósito**: Gestión completa del perfil de usuario y configuraciones.

**Secciones**:
- **Perfil**: Información básica del usuario
- **Datos Personales**: Edición de información personal
- **Seguridad**: Cambio de contraseña, 2FA, sesiones activas
- **Preferencias**: Idioma, zona horaria, formato de fecha
- **Notificaciones**: Configuración de alertas
- **Plan y Facturación**: Gestión de suscripción y métodos de pago
- **Soporte**: Enlaces de ayuda y contacto

**Funcionalidades Especiales**:
- Gestión múltiple de tarjetas de pago
- Modal para actualizar métodos de pago
- Verificación de email/teléfono
- Gestión de sesiones activas

### 🎛️ SideMenu.tsx
**Propósito**: Menú lateral de navegación principal.

**Funcionalidades**:
- Navegación entre secciones
- Indicador de página activa
- Información del usuario
- Animación de logout al hover
- Responsive (oculto en móvil)

### 🛒 SalesDrawer.tsx
**Propósito**: Panel lateral para gestión de ventas.

**Funcionalidades**:
- Lista de productos en carrito
- Modificación de cantidades
- Cálculo de impuestos y totales
- Notas internas
- Monto personalizable
- Navegación a pago

### 💳 PaymentScreen.tsx
**Propósito**: Pantalla de selección y procesamiento de pagos.

**Métodos de Pago**:
- Tarjeta de crédito/débito
- Apple Pay / Google Pay
- Criptomonedas (Coinbase Pay)
- Efectivo contra entrega

**Funcionalidades**:
- Formularios específicos por método
- Validación de datos
- Cálculo de cambio (efectivo)
- Interfaz intuitiva

### ✅ PaymentSuccessScreen.tsx
**Propósito**: Confirmación de pago exitoso con factura.

**Funcionalidades**:
- Animaciones de éxito
- Factura detallada
- Envío por email
- Descarga en PDF
- Opción de nueva orden

### 🃏 ProductCard.tsx
**Propósito**: Componente reutilizable para mostrar productos.

**Funcionalidades**:
- Imagen placeholder
- Información básica
- Efectos hover
- Click handler
- Diseño responsivo

## 🎨 Sistema de Diseño

### Colores Principales

```css
/* Colores de marca */
primary: '#FDE388'     /* CTAs principales */
complement: '#14B8A6'  /* Links y tooltips */
secondary: '#3B82F6'   /* Botones secundarios */

/* Estados */
success: '#10B981'     /* Éxito */
warning: '#F59E0B'     /* Advertencias */
error: '#DC2626'       /* Errores */

/* Texto */
text-primary: '#111827'    /* Títulos principales */
text-secondary: '#475569'  /* Texto secundario */

/* Fondos */
bg-main: '#FFFFFF'         /* Fondo principal */
bg-surface: '#FFFFFF'      /* Tarjetas y paneles */
divider: '#CBD5E1'         /* Bordes y divisores */
```

### Breakpoints Responsivos

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **React Router DOM** - Enrutamiento
- **Lucide React** - Iconografía
- **Vite** - Herramienta de build

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 🔌 Integración con Backend

### APIs Necesarias

El proyecto está preparado para integrarse con un backend que debe proporcionar las siguientes APIs:

#### 🔐 Autenticación
```typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
```

#### 📦 Productos
```typescript
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
GET /api/products/:id
```

#### 🏷️ Categorías
```typescript
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
```

#### 🛒 Órdenes de Venta
```typescript
GET /api/orders
POST /api/orders
PUT /api/orders/:id
GET /api/orders/:id
```

#### 📋 Órdenes de Compra
```typescript
GET /api/purchase-orders
POST /api/purchase-orders
PUT /api/purchase-orders/:id
DELETE /api/purchase-orders/:id
```

#### 🔍 OCR
```typescript
POST /api/ocr/process
GET /api/ocr/results/:id
```

#### 👤 Usuario
```typescript
GET /api/user/profile
PUT /api/user/profile
POST /api/user/change-password
GET /api/user/sessions
DELETE /api/user/sessions/:id
```

#### 💳 Pagos
```typescript
GET /api/payment-methods
POST /api/payment-methods
PUT /api/payment-methods/:id
DELETE /api/payment-methods/:id
POST /api/payments/process
```

### Estructura de Datos Sugerida

#### Producto
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  lowStockAlert: number;
  sku: string;
  category: string;
  images: string[];
  variants: ProductVariant[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Usuario
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Seguridad

### Consideraciones de Seguridad
- Validación de entrada en frontend y backend
- Autenticación JWT recomendada
- HTTPS obligatorio en producción
- Sanitización de datos OCR
- Validación de archivos subidos
- Rate limiting en APIs

### Variables de Entorno
```env
VITE_API_URL=http://localhost:3000/api
VITE_OCR_SERVICE_URL=http://localhost:3001
VITE_PAYMENT_GATEWAY_KEY=your_payment_key
```

## 📱 Responsive Design

### Estrategia Mobile-First
- Diseño optimizado para móviles
- Navegación adaptativa
- Tablas que se convierten en cards
- Menús colapsables
- Touch-friendly interfaces

### Componentes Adaptativos
- `SideMenu`: Oculto en móvil, visible en desktop
- `SalesDrawer`: Bottom sheet en móvil, sidebar en desktop
- Tablas: Cards en móvil, tablas en desktop
- Formularios: Una columna en móvil, dos en desktop

## 🧪 Testing (Recomendado)

### Herramientas Sugeridas
- **Jest** - Testing framework
- **React Testing Library** - Testing de componentes
- **Cypress** - Testing E2E
- **MSW** - Mock Service Worker para APIs

### Casos de Prueba Críticos
- Flujo de autenticación completo
- Creación y edición de productos
- Procesamiento de pagos
- Funcionalidad OCR
- Responsive design

## 🚀 Despliegue

### Preparación para Producción
1. **Build de producción**
   ```bash
   npm run build
   ```

2. **Variables de entorno**
   - Configurar URLs de producción
   - Keys de servicios externos
   - Configuración de analytics

3. **Optimizaciones**
   - Lazy loading de componentes
   - Optimización de imágenes
   - Compresión de assets
   - CDN para recursos estáticos

### Plataformas Recomendadas
- **Vercel** - Despliegue automático desde Git
- **Netlify** - Hosting estático con funciones
- **AWS S3 + CloudFront** - Escalabilidad empresarial
- **Docker** - Containerización para cualquier plataforma

## 🤝 Contribución

### Guías de Desarrollo
1. Seguir convenciones de TypeScript
2. Usar Tailwind CSS para estilos
3. Componentes funcionales con hooks
4. Props tipadas con interfaces
5. Comentarios JSDoc para funciones complejas

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: adición de tests
```

## 📞 Soporte

### Recursos de Ayuda
- Documentación de React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- TypeScript: https://typescriptlang.org
- Vite: https://vitejs.dev

### Contacto
Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

**Nota**: Este es un proyecto frontend que requiere integración con un backend para funcionalidad completa. Todas las funcionalidades de datos están simuladas con datos mock para demostración.