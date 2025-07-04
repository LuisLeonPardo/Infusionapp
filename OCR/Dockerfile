# Usa una imagen base oficial de Python
FROM python:3.9-slim

# 1) Establece el directorio de trabajo
WORKDIR /app

# 2) Instala librerías del sistema necesarias para OpenCV, PDF y Tesseract
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    poppler-utils \
    tesseract-ocr \
    libtesseract-dev \
    tesseract-ocr-spa \
    && rm -rf /var/lib/apt/lists/*

# Configurar las variables de entorno
ENV FLASK_DEBUG=0
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/5/tessdata

# 3) Copia los archivos de requisitos
COPY requirements.txt requirements.txt

# 4) Instala las dependencias Python
RUN pip install --no-cache-dir -r requirements.txt

# Verificar datos de Tesseract
RUN ls -la /usr/share/tesseract-ocr/5/tessdata/ && echo "TESSDATA cargado correctamente"

# 5) Copia el resto de los archivos de la aplicación
COPY . .

# 6) Expone el puerto en el que la aplicación correrá
EXPOSE 10000

# 7) Comando final para arrancar Gunicorn
CMD gunicorn backend:app --bind 0.0.0.0:$PORT --timeout 300 --workers 1 --threads 1
