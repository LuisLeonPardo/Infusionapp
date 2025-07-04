# Backend OCR - Documentación Detallada

Este proyecto implementa un backend en **Flask** destinado a procesar facturas o documentos similares utilizando modelos de detección (YOLOv5) y OCR (EasyOCR/Tesseract). A continuación encontrarás una descripción exhaustiva de su funcionamiento, estructura y cómo integrarlo con un frontend.

## Índice
1. [Requisitos previos](#requisitos-previos)
2. [Estructura general del proyecto](#estructura-general-del-proyecto)
3. [Descripción de los componentes](#descripcion-de-los-componentes)
4. [Endpoints disponibles](#endpoints-disponibles)
5. [Ejecutar el backend](#ejecutar-el-backend)
6. [Uso desde un frontend](#uso-desde-un-frontend)
7. [Notas adicionales](#notas-adicionales)

## Requisitos previos
- **Python 3.9+** – Se utilizan librerías que actualmente funcionan de forma estable con esta versión.
- **Tesseract OCR** – Debe estar instalado junto con sus datos para español (`tesseract-ocr-spa`). En el Dockerfile ya se incluyen estas dependencias.
- **PyTorch** – Requerido para cargar el modelo YOLOv5 y la librería EasyOCR.
- **Dependencias Python** – Se listan en `requirements.txt`. Incluyen `Flask`, `Flask-Cors`, `opencv-python-headless`, `easyocr`, `ultralytics`, entre otras.

Puedes instalar todo con:
```bash
pip install -r requirements.txt
```

En entornos de producción se recomienda utilizar el contenedor Docker provisto o crear un entorno virtual para aislar dependencias.

## Estructura general del proyecto

```text
backend-ocr/
├── app.py                 # Ejemplo simplificado del servidor
├── backend.py             # Servidor principal con todas las rutas
├── datasets/              # Datos y archivo `data.yaml` con las clases del modelo
├── yolov5/                # Submódulo de la librería YOLOv5
├── Dockerfile             # Imagen Docker para desplegar el servicio
├── requirements.txt       # Dependencias principales
└── ... (archivos de apoyo y pruebas)
```

`backend.py` es el archivo que expone la mayor cantidad de funcionalidades. `app.py` es una versión reducida utilizada durante el desarrollo inicial.

## Descripción de los componentes

### Carga de modelo y configuración (backend.py)
- Se utilizan variables de entorno para definir el modelo (`MODEL_PATH`) y la configuración de CORS.
- El modelo de detección se carga con `torch.hub.load` apuntando a la carpeta local `yolov5` y al archivo `best.pt` entrenado previamente.
- Las clases posibles se leen del archivo `datasets/data.yaml`. Si no se encuentra, se utilizan valores por defecto para mantener la compatibilidad.
- Tesseract se configura mediante `pytesseract.pytesseract.tesseract_cmd` y la variable `TESSDATA_PREFIX`.

### Funciones clave
- **allowed_file** – Verifica si el archivo tiene una extensión soportada (`png`, `jpg`, `jpeg`, `tiff`, `bmp` o `pdf`).
- **detect_sections** – Ejecuta YOLOv5 sobre la imagen para detectar regiones como logo, R.U.C., números de factura o líneas de productos. Devuelve un DataFrame con las coordenadas de cada detección.
- **easyocr_text_regions** – Aplica EasyOCR para obtener texto de toda la imagen y devuelve las cajas detectadas junto a su texto.
- **group_bboxes_by_rows_and_cols** – Agrupa las cajas de texto por filas y columnas, identificando las columnas de descripción, cantidad y precio.
- **extract_text_from_roi** – Conjuga las detecciones YOLO y las cajas de EasyOCR para obtener la información tabular de la factura.
- **mark_detections** – Dibuja las cajas detectadas en la imagen y permite enviarla al frontend como base64 para depuración.

El archivo `app.py` contiene versiones simplificadas de estas funciones y puede servir para comprender el flujo básico.

### Almacenamiento de resultados
- `data_invoices.json` guarda las tablas corregidas que envíe el usuario.
- `orders.json` mantiene un listado de facturas archivadas, cada una con un identificador, fecha, proveedor y líneas extraídas.
- `providers.json` permite almacenar proveedores disponibles para el sistema.

## Endpoints disponibles
El servidor define varias rutas HTTP (todas devuelven y reciben JSON):

- `POST /process-document` – Recibe una imagen o PDF con la clave `file` y devuelve los datos extraídos y la imagen marcada.
- `POST /save-document-changes` – Guarda los cambios que el usuario realice en las líneas extraídas (se envía `rows` e `invoiceNumber`).
- `POST /archive-invoice` – Guarda definitivamente la factura en `orders.json`.
- `GET  /get-orders` – Devuelve la lista de facturas archivadas.
- `GET  /get-order/<id>` – Devuelve la información de una factura específica.
- `GET  /get-providers` – Lista los proveedores almacenados.

## Ejecutar el backend
### Opción 1: Con Docker
```bash
docker build -t backend-ocr .
docker run -p 5000:10000 backend-ocr
```
El contenedor expone el puerto 10000 (configurable con la variable `PORT`). Internamente arranca `gunicorn` ejecutando `backend:app`.

### Opción 2: Localmente
```bash
python backend.py
```
El servidor quedará disponible en `http://localhost:5000`.

### Pruebas rápidas
Hay dos scripts de prueba simples:
```bash
pytest -q  # Ejecuta test_model.py y test_torch.py
```
Estos scripts sólo verifican que PyTorch esté instalado y que el modelo pueda cargarse (no son pruebas unitarias extensas).

## Uso desde un frontend
Un frontend (por ejemplo React o cualquier aplicación web) puede interactuar de la siguiente forma:

1. **Subir un archivo**: enviar un `FormData` con el campo `file` a `POST /process-document`.
2. **Mostrar la respuesta**: la API devuelve las filas detectadas en `data` y la imagen con las detecciones en `image` (base64). Se puede presentar en una tabla editable para que el usuario corrija los valores.
3. **Guardar cambios**: enviar las filas editadas a `POST /save-document-changes` junto con el número de factura.
4. **Archivar la factura**: usar `POST /archive-invoice` para guardar definitivamente la factura en `orders.json`.

Al habilitar `Flask-Cors` se permite que cualquier origen consuma la API (o se pueden restringir dominios específicos editando la lista `allowed_origins`).

## Notas adicionales
- Si deseas entrenar de nuevo el modelo YOLOv5 o actualizar `data.yaml`, coloca los archivos dentro de la carpeta `datasets/` y ajusta `MODEL_PATH` en `backend.py`.
- El proyecto incluye imágenes de depuración (`debug_roi_*.jpg`) que muestran ejemplos de las regiones detectadas.
- Los archivos `dependencies_local.txt` y `dependencies_production.txt` corresponden al listado de paquetes instalados en diferentes entornos y sirven como referencia.

Este README pretende servir como guía completa para entender el proyecto y adaptarlo a tus necesidades, ya seas desarrollador backend o simplemente desees integrar el servicio en un frontend.
