# Documentación del proyecto

Este repositorio contiene una API REST escrita en **TypeScript** con **Express** y un proyecto de **Strapi** que funciona como CMS. A continuación se detallan los componentes, requisitos y la forma de utilizarlos desde un frontend.

## Estructura general

- **APIREST/** – Servicio Express que actúa como puente hacia Strapi y expone endpoints propios.
- **AlcolabsStrapi/** – Código de Strapi con los *content types* y configuración.
- **docker-compose.yml** – Levanta Strapi, la API Express y una base de datos Postgres con Docker.

## Requisitos previos

- Node.js 18 o superior
- Docker y Docker Compose (opcional pero recomendado)
- Variables de entorno para cada servicio

### Variables de entorno principales

En el proyecto de Strapi existe el archivo `.env.example` con las principales variables, entre ellas las referentes a la base de datos:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS="toBeModified1,toBeModified2"
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=alcolabspgdatabase
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
```

La API Express usa `STRAPI_URL` para saber dónde está la API de Strapi y `JWT_SECRET` para validar los tokens JWT.

## Puesta en marcha

### Con Docker Compose

```bash
docker-compose up --build
```

Este comando levanta una instancia de Postgres, el backend de Strapi en `http://localhost:1337` y la API Express en `http://localhost:4000`.

### Ejecución manual

1. **Instalar dependencias de Strapi**
   ```bash
   cd AlcolabsStrapi
   npm install
   npm run develop
   ```
2. **Instalar dependencias de la API REST**
   ```bash
   cd APIREST
   npm install
   npm run dev   # ejecuta ts-node con nodemon
   ```

## Estructura del backend Express

El archivo principal es [`APIREST/src/index.ts`](APIREST/src/index.ts). Allí se configura Express y se cargan las rutas de productos y autenticación:

```ts
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
```

### Middleware

- [`getUserIdFromToken`](APIREST/src/middlewares/userFromToken.ts) – Extrae el `userId` de un token JWT. Si el token no es válido devuelve `401`.

### Controladores

- **[`authController.ts`](APIREST/src/controllers/authController.ts)**
  - `login` – Envía las credenciales a Strapi para obtener un JWT y lo devuelve al cliente.
- **[`productController.ts`](APIREST/src/controllers/productController.ts)**
  - `getAllProductsStrapi` – Lista productos de Strapi filtrados por usuario.
  - `getProductFromStrapi` – Obtiene un producto específico según ID.
  - `createProductInStrapi` – Crea un nuevo producto en Strapi.
  - `updateProductInStrapi` – Actualiza un producto existente.
  - `buyProductsStrapi` – Verifica stock, reduce inventario y genera alertas.
  - Funciones internas `reduceStockStrapi`, `validateStockStrapi` y `alertStockStrapi` se encargan de actualizar el stock y revisar alertas.

Las rutas se definen en `APIREST/src/routes/` y utilizan el middleware para proteger los endpoints que lo requieren.

## Estructura del proyecto Strapi

Strapi define diferentes *content types* que se encuentran en `AlcolabsStrapi/src/api/`:

- **Product** (`product`) – Incluye nombre, código de barras, descripción, precio, stock y una relación con *Category*.
- **Category** (`category`) – Contiene un nombre y descripción y se relaciona con varios productos.
- **Store** (`store`) – Almacena información de tiendas (nombre y dirección).
- **Invoice** (`invoice`) – Guarda facturas con número e importe total.

Strapi genera automáticamente controladores, rutas y servicios para cada tipo de contenido. Las configuraciones adicionales están en `AlcolabsStrapi/config/`.

## Uso desde un frontend

1. **Autenticación**
   - Enviar una petición `POST /api/auth` con `identifier` y `password` para recibir un token JWT.
2. **Consumir productos**
   - Incluir el token en el encabezado `Authorization: Bearer <token>` y llamar a los endpoints de `/api/products` para listar, crear o actualizar productos.
   - Para registrar una compra usar `POST /api/products/buyProducts` con la lista de productos y cantidades.

La API Express comunica estas peticiones con Strapi para centralizar la lógica de negocio.

## Información adicional

- Los controladores de categorías e invoices están presentes pero comentados, por lo que podrían expandirse en el futuro.
- Para crear la base de datos en producción se utilizan las variables definidas en Docker Compose.

Con esta documentación cualquier usuario, sea o no desarrollador backend, debería comprender el flujo general de la aplicación y cómo integrar un frontend a la misma.

