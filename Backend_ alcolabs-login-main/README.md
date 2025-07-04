# Alcolabs Login - Documentación Detallada

Este repositorio contiene un ejemplo completo de autenticación con Node.js, Express y MongoDB, acompañado de un cliente en React. A continuación se explica con detalle la estructura de carpetas, cada función o componente relevante y los pasos necesarios para ponerlo en marcha.

## Contenido del proyecto

```
.
├── app.js               # Punto de entrada del servidor Express
├── controllers/         # Controladores de la API REST
│   └── user.js
├── middleware/          # Middlewares personalizados
│   └── auth.js
├── models/              # Esquemas de Mongoose
│   └── User.js
├── routes/              # Definición de rutas de Express
│   └── user.js
├── db/                  # Conexión a base de datos y componente React adicional
│   ├── connect.js
│   └── index.tsx        # Ejemplo de componente de código de acceso (React Native)
├── client/              # Aplicación React que consume la API
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── HomeLayout.jsx
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Logout.jsx
│       │   └── Register.jsx
│       └── styles/      # Hojas de estilo CSS
└── package.json         # Dependencias del backend
```

## Requisitos previos

- **Node.js** y **npm** (versión recomendada: >= 18).
- **MongoDB** en ejecución o un servicio de MongoDB en la nube (por ejemplo Atlas).
- Opcionalmente **Vite** para ejecutar el cliente React.

### Variables de entorno

Cree un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
MONGO_URI=<cadena de conexión a MongoDB>
JWT_SECRET=<secreto para firmar JWT>
PORT=3000 # opcional, por defecto 3000
```

## Instalación

1. Clonar el repositorio y situarse en la carpeta principal.
2. Instalar dependencias del backend:
   ```bash
   npm install
   ```
3. Entrar en la carpeta `client` e instalar las dependencias del frontend:
   ```bash
   cd client
   npm install
   ```
4. Volver a la raíz para ejecutar el servidor:
   ```bash
   cd ..
   node app.js
   ```
5. Para ejecutar el cliente React en modo desarrollo:
   ```bash
   cd client
   npm run dev
   ```

El servidor quedará a la espera en `http://localhost:3000` (o el puerto especificado) y el cliente se servirá normalmente en `http://localhost:5173` por defecto.

## Estructura del Backend y descripción de funciones

### `app.js`
Archivo principal donde se configura Express y se levanta el servidor.

- **`require('dotenv').config()`**: carga las variables de entorno.
- **`require('express-async-errors')`**: permite manejar errores en funciones `async` sin usar `try/catch` explícitos en cada ruta.
- **`connectDB`**: función que conecta a MongoDB (definida en `db/connect.js`).
- Se aplican los middlewares `express.json()` y `cors()` para parsear JSON y permitir peticiones desde el frontend.
- Todas las rutas se agrupan bajo `/api/v1` gracias a `mainRouter` (definido en `routes/user.js`).
- La función `start()` conecta a la base de datos y pone el servidor a escuchar en el puerto indicado.

### `db/connect.js`
Contiene una única función:
```javascript
const connectDB = (url) => {
  return mongoose.connect(url, {});
};
```
Devuelve la promesa generada por `mongoose.connect` para enlazar con la base de datos.

### `models/User.js`
Define el esquema de usuarios de MongoDB. Campos principales:
- `name`: nombre completo, requerido.
- `email`: debe ser único y con formato de correo válido.
- `password`: contraseña que se cifrará automáticamente.

Incluye dos funciones importantes:
- **Middleware `pre('save')`**: antes de guardar un usuario, genera un `salt` y cifra la contraseña con `bcrypt`.
- **`comparePassword`**: método de instancia que recibe una contraseña candidata y la compara con la almacenada.

### `controllers/user.js`
Agrupa las funciones que responden a las rutas de autenticación.

1. **`login`**
   - Extrae `email` y `password` del cuerpo de la petición.
   - Busca el usuario por correo y utiliza `comparePassword` para validar la contraseña.
   - Si coincide, genera un token JWT con `jwt.sign` que contiene el id y nombre del usuario. Devuelve `{ msg, token }`.

2. **`dashboard`**
   - Requiere que el middleware de autenticación haya añadido `req.user`.
   - Genera un número aleatorio y responde con un mensaje personalizado y un "número de la suerte".

3. **`getAllUsers`**
   - Obtiene la lista completa de usuarios almacenados en la base de datos.

4. **`register`**
   - Comprueba si ya existe un usuario con el correo indicado.
   - Si no existe, crea un usuario nuevo con los datos recibidos; la contraseña se encripta automáticamente por el `pre('save')` del modelo.

### `middleware/auth.js`
Middleware que protege rutas privadas (como el dashboard).

- Revisa el encabezado `Authorization` buscando el formato `Bearer <token>`.
- Verifica el token con `jwt.verify` y, si es válido, adjunta `{ id, name }` a `req.user` para uso posterior.
- Si algo falla, responde con estado 401 (no autorizado).

### `routes/user.js`
Define las rutas expuestas por la API:
- `POST /api/v1/login` → `login`
- `POST /api/v1/register` → `register`
- `GET  /api/v1/dashboard` → `dashboard` (requiere `authMiddleware`)
- `GET  /api/v1/users` → `getAllUsers`

### `db/index.tsx`
Aunque está ubicado dentro de `db`, este archivo contiene un componente de React Native que muestra un teclado numérico y un pequeño mecanismo de código de acceso (passcode). Sirve como ejemplo independiente y no se utiliza directamente en la web.

## Estructura del Frontend

Dentro de la carpeta `client` se encuentra una aplicación creada con Vite y React. Los componentes principales son:

- **`src/App.jsx`**: configura las rutas con `react-router-dom` y define las páginas disponibles (Landing, Login, Register, Dashboard, Logout).
- **`src/pages/Landing.jsx`**: página inicial con enlaces para registrarse o iniciar sesión.
- **`src/pages/Login.jsx`**: formulario de login; envía las credenciales al backend (`/api/v1/login`). Al recibir el token lo guarda en `localStorage` y redirige al dashboard.
- **`src/pages/Register.jsx`**: formulario de registro; crea un nuevo usuario mediante `/api/v1/register`.
- **`src/pages/Dashboard.jsx`**: página protegida que consulta `/api/v1/dashboard` enviando el token en la cabecera `Authorization`. Muestra un mensaje personalizado y un número aleatorio.
- **`src/pages/Logout.jsx`**: elimina el token de `localStorage` y redirige al usuario después de unos segundos.
- **`src/pages/HomeLayout.jsx`**: contenedor base que renderiza el resto de páginas a través de `<Outlet />`.

Las hojas de estilo se encuentran en `src/styles/` y el archivo `main.jsx` inicia la aplicación en el elemento `#root` del `index.html`.

## Cómo aplicar el backend a otro frontend

El backend expone una API REST sencilla que cualquier frontend puede consumir. Los pasos básicos para integrarlo son:

1. Enviar una solicitud `POST` a `/api/v1/register` para crear un nuevo usuario. Debe incluir `username`, `email` y `password` en el cuerpo de la petición JSON.
2. Realizar `POST` a `/api/v1/login` con `email` y `password`. Si las credenciales son correctas se recibirá un `token`.
3. Guardar el token (por ejemplo en `localStorage`) y enviarlo en el encabezado `Authorization: Bearer <token>` al llamar a rutas protegidas como `/api/v1/dashboard`.
4. Para cerrar sesión, simplemente eliminar el token guardado.

Cualquier framework o aplicación móvil/web puede seguir estas mismas llamadas HTTP para autenticarse contra este servidor.

## Pruebas

Actualmente el proyecto no incluye pruebas automatizadas. El script por defecto solo muestra un mensaje de error. Puede ejecutarse con:

```bash
npm test
```

## Datos adicionales

- El token generado caduca en 30 días (`expiresIn: '30d'`).
- `express-async-errors` simplifica la captura de excepciones en los controladores.
- `cors` está habilitado de manera global para permitir peticiones desde el cliente React.
- La carpeta `Login-Alcolabs` está vacía; puede usarse para futuras expansiones.

---
