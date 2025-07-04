from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
from pdf2image import convert_from_bytes
import pandas as pd
import cv2
import pytesseract
import torch
import traceback
from pathlib import Path


# Ejemplo básico para verificar si OpenCV funciona
print(cv2.__version__)


app = Flask(__name__)


# Cargar modelo YOLOv5 preentrenado
model = torch.hub.load('ultralytics/yolov5', 'custom', path='best.pt', force_reload=True)

#solicitudes desde tu dominio en Vercel

# CORS(app, resources={r"/*": {"origins": ["https://web-rose-five.vercel.app", "http://localhost:3000"]}})
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)



def allowed_file(filename):
    allowed_extensions = {'png', 'jpg', 'jpeg', 'tiff', 'bmp', 'pdf'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
    return thresh

def detect_sections(image):
    results = model(image)
    detections = results.pandas().xyxy[0]
    return detections

def extract_tables_and_text(image, detections):
    table_data = []
    for _, row in detections.iterrows():
        if row['name'] == 'Product_Table':
            # Recortar la región correspondiente a la tabla de productos
            x_min, y_min, x_max, y_max = int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])
            table_image = image[y_min:y_max, x_min:x_max]

            # Aplicar OCR a la tabla
            ocr_result = pytesseract.image_to_string(table_image, config='--psm 6', lang='spa')
            rows = ocr_result.split('\n')
            cleaned_rows = [clean_row(row) for row in rows if row.strip() != '']
            table_data.extend(cleaned_rows)
    return table_data

def extract_key_value_pairs(image, detections):
    key_value_pairs = {}
    for _, row in detections.iterrows():
        if row['name'] == 'Invoice_Header' or row['name'] == 'Total_Amount':
            x_min, y_min, x_max, y_max = int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])
            section_image = image[y_min:y_max, x_min:x_max]

            # Aplicar OCR para obtener todos los textos de la sección
            ocr_result = pytesseract.image_to_data(section_image, output_type=pytesseract.Output.DATAFRAME, lang='spa')
            ocr_result = ocr_result[ocr_result.conf > 50]
            
            current_key = None
            current_value = ""
            for _, word_row in ocr_result.iterrows():
                word = word_row['text']
                if word.endswith(":"):
                    if current_key:
                        key_value_pairs[current_key] = current_value.strip()
                    current_key = word[:-1]
                    current_value = ""
                elif current_key:
                    current_value += word + " "
            if current_key:
                key_value_pairs[current_key] = current_value.strip()
    return key_value_pairs

def process_image(file):
    try:
        # Leer la imagen en memoria
        image = Image.open(file.stream).convert('RGB')
        image = np.array(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Verificar que la imagen no está vacía
        if image is None or image.size == 0:
            return {'error': 'Error al procesar la imagen: imagen vacía o inválida.'}

        # Detectar secciones con YOLOv5
        detections = detect_sections(image)

        # Extraer tablas y pares clave-valor
        table_data = extract_tables_and_text(image, detections)
        key_value_pairs = extract_key_value_pairs(image, detections)

        # Separar encabezados y cuerpo de la tabla
        headers = table_data[0] if len(table_data) > 0 else []
        table_body = table_data[1:] if len(table_data) > 1 else []

        return {'headers': headers, 'tableData': table_body, 'keyValuePairs': key_value_pairs}

    except Exception as e:
        print(f"Error al procesar la imagen: {e}")
        traceback.print_exc()
        return {'error': f'Error al procesar la imagen: {e}'}

def process_pdf(file):
    try:
        # Convertir PDF a imágenes
        images = convert_from_bytes(file.read())
        all_table_data = []
        all_key_value_pairs = {}

        for image in images:
            image_array = np.array(image)
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)

            detections = detect_sections(image_array)
            table_data = extract_tables_and_text(image_array, detections)
            key_value_pairs = extract_key_value_pairs(image_array, detections)

            if table_data:
                all_table_data.extend(table_data)
            if key_value_pairs:
                all_key_value_pairs.update(key_value_pairs)

        headers = all_table_data[0] if len(all_table_data) > 0 else []
        table_data = all_table_data[1:] if len(all_table_data) > 1 else []

        return {'headers': headers, 'tableData': table_data, 'keyValuePairs': all_key_value_pairs}

    except Exception as e:
        print(f"Error al procesar el PDF: {e}")
        traceback.print_exc()
        return {'error': f'Error al procesar el PDF: {e}'}

@app.route('/process-document', methods=['POST'])
def process_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'El nombre del archivo está vacío'}), 400

    if file and allowed_file(file.filename):
        filename = file.filename.lower()
        if filename.endswith('.pdf'):
            data = process_pdf(file)
        else:
            data = process_image(file)

        if 'error' in data:
            return jsonify({'error': data['error']}), 500

        return jsonify({'data': data}), 200
    else:
        return jsonify({'error': 'Tipo de archivo no soportado'}), 400

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000)
