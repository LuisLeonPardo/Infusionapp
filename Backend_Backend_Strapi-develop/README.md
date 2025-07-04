# Proyecto Strapi

Este repositorio contiene una instancia de **Strapi** configurada para crear una API REST lista para consumir desde cualquier frontend. A continuación se detalla la estructura del proyecto, los pasos para ponerlo en marcha y la explicación de cada componente principal para que cualquier persona (sea o no desarrolladora back‑end) pueda entenderlo y comenzar a utilizarlo.

## Requisitos previos

- **Node.js** 18.x (recomendado) y **npm** 6 o superior.
- Acceso a una base de datos. El proyecto incluye configuración para SQLite y PostgreSQL.
- Opcionalmente, Docker si se prefiere ejecutar la aplicación en contenedores.

## Instalación

1. Clonar el repositorio y acceder a la carpeta del proyecto.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Copiar el archivo `.env.example` (si existe) a `.env` y definir las variables de entorno necesarias (por ejemplo credenciales de la base de datos y claves de la aplicación).

## Comandos disponibles

- `npm run develop` – Inicia Strapi en modo de desarrollo con recarga automática.
- `npm run start` – Inicia Strapi en modo producción.
- `npm run build` – Genera el panel de administración listo para producción.

## Uso con Docker

El proyecto incluye un `docker-compose.yml` y un `Dockerfile` para facilitar la ejecución en contenedores. Con Docker instalado basta con ejecutar:

```bash
docker compose up --build
```

Esto levantará un contenedor de PostgreSQL junto con la aplicación de Strapi configurada para producción.

## Estructura del proyecto

- **config/** – Archivos de configuración de Strapi (base de datos, servidor, middlewares, etc.).
- **src/** – Código fuente de la aplicación.
  - **api/** – Cada subcarpeta corresponde a un tipo de contenido (API) con sus controladores, servicios y rutas.
  - **admin/** – Configuración opcional del panel de administración.
  - **index.ts** – Punto de entrada donde es posible registrar o ejecutar lógica de arranque.
- **public/** – Archivos estáticos servidos por Strapi.

### APIs incluidas

Dentro de `src/api/` se encuentran cuatro tipos de contenido principales:

1. **Category** (`api::category.category`)
   - Atributos: `name`, `description` y relación uno a muchos con **Product**.
2. **Product** (`api::product.product`)
   - Atributos: `name`, `barcode`, `description`, `price`, `stock`, `inventoryAlert`, `inventoryAlertCount`, `customFeatures`, `user` y relación muchos a uno con **Category**.
3. **Invoice** (`api::invoice.invoice`)
   - Atributos: `invoiceNumber`, `totalAmount`, `customeFeatures`.
4. **Store** (`api::store.store`)
   - Atributos: `name`, `direction`, `number`.

Cada API cuenta con archivos de **rutas**, **controladores** y **servicios** generados automáticamente por Strapi mediante las funciones `createCoreRouter`, `createCoreController` y `createCoreService`. Estos archivos sirven como puntos de extensión para personalizar el comportamiento de cada endpoint si fuera necesario.

### Configuración principal

- `config/database.ts` – Define el cliente de base de datos y sus credenciales. Admite SQLite (por defecto), MySQL o PostgreSQL.
- `config/server.ts` – Configuración del host y puerto donde se ejecutará Strapi.
- `config/middlewares.ts` – Lista de middlewares utilizados por la aplicación.
- `config/admin.ts` – Opciones para el panel de administración (autenticación, tokens, etc.).

## Consumiendo la API desde un Frontend

Una vez que la aplicación está en marcha (`npm run develop` o `docker compose up`), las rutas generadas para cada contenido estarán disponibles en `/api/<nombre>`.
Por ejemplo, para obtener la lista de productos desde un frontend basado en JavaScript se puede hacer una solicitud HTTP sencilla:

```javascript
fetch('http://localhost:1337/api/products')
  .then(res => res.json())
  .then(data => console.log(data));
```

Strapi expone los métodos habituales (`GET`, `POST`, `PUT`, `DELETE`) para manejar cada contenido. Además, puede habilitarse el plugin de autenticación de usuarios si se requiere proteger ciertos endpoints.

## Sugerencias de integración

- Utilizar la colección **Category** para organizar los productos según su categoría.
- Registrar tiendas en la colección **Store** y relacionarlas con facturas o productos según sea necesario.
- Personalizar los controladores o servicios en `src/api/<collection>/` para añadir lógica de negocio a medida.

## Recursos adicionales

- [Documentación oficial de Strapi](https://docs.strapi.io)
- [Tutoriales y ejemplos](https://strapi.io/blog)

Con esta base, cualquier desarrolladora o desarrollador puede ampliar la API, crear nuevas relaciones o integrar Strapi con el frontend de su preferencia (React, Vue, Angular, etc.).
