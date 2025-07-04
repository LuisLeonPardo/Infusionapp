# Etapa de construcción
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias necesarias para la compilación
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir el proyecto
RUN npm run build


# Establecer el directorio de trabajo en el contenedor de producción
WORKDIR /app


# Exponer el puerto en el que Strapi escuchará (por defecto 1337)
EXPOSE 1337

# Configurar variables de entorno para producción
ENV NODE_ENV=production
ENV DATABASE_CLIENT=postgres
ENV DATABASE_HOST=your_database_host
ENV DATABASE_PORT=5432
ENV DATABASE_NAME=your_database_name
ENV DATABASE_USERNAME=your_database_user
ENV DATABASE_PASSWORD=your_database_password

# Comando para iniciar la aplicación en producción
CMD ["npm", "start"]
