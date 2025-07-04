from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.cluster import DBSCAN
from PIL import Image
import torch  
import cv2
import pytesseract
import traceback
from pdf2image import convert_from_bytes
import os
import re
import base64
import io
from pathlib import Path
import pandas as pd  
from dotenv import load_dotenv
import sys
import yaml
import json
import uuid
import easyocr
import numpy as np
from PIL import Image
if not hasattr(Image, 'ANTIALIAS'):
    Image.ANTIALIAS = Image.Resampling.LANCZOS

from craft_text_detector import Craft, craft_utils
import craft_text_detector.predict as craft_predict


_original_get_prediction = craft_predict.get_prediction

def patched_get_prediction(model, image, text_threshold, link_threshold, low_text, cuda, poly, refine, **kwargs):
    prediction_result = _original_get_prediction(model, image, text_threshold, link_threshold, low_text, cuda, poly, refine, **kwargs)

    if "boxes" in prediction_result:
        boxes_as_ratio = []
        img_height, img_width = image.shape[:2]
        for box in prediction_result["boxes"]:
            try:
                
                box_arr = np.array(box, dtype=np.float32)
                
                if box_arr.ndim > 1:
                    box_arr = box_arr.flatten()
               
                ratio = box_arr / np.array([img_width, img_height], dtype=np.float32)
                boxes_as_ratio.append(ratio.tolist())
            except Exception as e:
                # Si me falla, se agrega la caja sin modificar
                boxes_as_ratio.append(box)
        prediction_result["boxes"] = boxes_as_ratio
    return prediction_result

craft_predict.get_prediction = patched_get_prediction
print("Parche de get_prediction aplicado:", craft_predict.get_prediction)


load_dotenv()
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR / 'yolov5'))  

try:
    from utils.general import non_max_suppression
except ImportError:
    non_max_suppression = None 

app = Flask(__name__)

NGROK_URL = os.getenv("NEXT_PUBLIC_API_URL", "")
ENV = os.getenv("FLASK_ENV", "production")

allowed_origins = [
    "http://127.0.0.1:3000",  # Localhost para desarrollo
    "https://web-navy-nine.vercel.app",  # App en Vercel
    "https://*.ngrok-free.app"  # Dominios de ngrok
]

if NGROK_URL:
    allowed_origins.append(NGROK_URL) #dinamica

if ENV == "development":
    CORS(app, resources={r"/*": {"origins": ["https://*.ngrok-free.app", "https://web-navy-nine.vercel.app/ocr"]}}, supports_credentials=True)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    print("CORS configurado para desarrollo (orígenes: *)")
else:
   
 @app.after_request
 def add_cors_headers(response):
    """
    Agregar encabezados CORS adicionales para asegurar compatibilidad.
    """
    origin = request.headers.get("Origin")
    if origin and origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response
MODEL_PATH = Path('/home/yesenia/Escritorio/react/Alcolab/Web/backend/backup-backend-ocr.git/yolov5/runs/train/exp_retrain/weights/best.pt')
DATA_PATH = BASE_DIR / 'datasets/data.yaml'
print(f"Ruta esperada de data.yaml: {DATA_PATH}")  
if not MODEL_PATH.exists():
    print(f"ERROR: El modelo no existe en la ruta: {MODEL_PATH}")
    exit(1)

    if not MODEL_PATH.exists():
        print(f"ERROR: El modelo no existe en la ruta: {MODEL_PATH}")
    exit(1)

    if not DATA_PATH.exists():
        print(f"ERROR: No se encontro el archivo de configuracion: {DATA_PATH}")
        print("Usando fallback de clases en código.")
        exit(1)


if DATA_PATH.exists():
    print(f"✅ Archivo data.yaml encontrado en: {DATA_PATH}")
    try:
        with open(DATA_PATH, 'r') as file:
            yaml_content = yaml.safe_load(file)
            classes = yaml_content.get('names', [])  
            if classes:
                print(f"✅ Clases cargadas correctamente: {classes}")
            else:
                print("⚠️ WARNING: No se encontraron clases en el YAML.")
    except yaml.YAMLError as e:
        print(f"⚠️ ERROR al leer el YAML: {e}")
        classes = []
else:
    print(f"❌ ERROR: No se encontró el archivo de clases en {DATA_PATH}")
    classes = []


pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
TESSDATA_DIR = '/usr/share/tesseract-ocr/5/tessdata/'
os.environ['TESSDATA_PREFIX'] = TESSDATA_DIR
print(f"Tesseract versión: {pytesseract.get_tesseract_version()}")
print(f"TESSDATA_PREFIX: {os.environ.get('TESSDATA_PREFIX')}")
DATA_PATH = BASE_DIR / 'datasets/data.yaml'
if not DATA_PATH.exists():
    print("Usando fallback de clases en código.")
    classes = {0: 'logo', 1: 'R.U.C', 2: 'numero_factura', 3: 'fecha_hora',
               4: 'razon_social', 5: 'cantidad', 6: 'descripcion', 7: 'precio_unitario',
               8: 'precio_total', 9: 'subtotal', 10: 'iva',11: 'Descripcion', 12: 'Cantidad', 13: 'unidades', 14: 'unidad', 15: 'Cajas_cantidad', 16: 'Articulo', 17: 'Nombre_del_producto'}
    print(f"Clases por defecto: {classes}")
    print(f"Clases cargadas desde YAML: {classes}")
    print(f"Ruta esperada de data.yaml: {DATA_PATH}")

else:
     with open(DATA_PATH, 'r') as file:
        classes = yaml.safe_load(file).get('names', {})
     print(f"Clases cargadas desde YAML: {classes}")

try:
    model = torch.hub.load(
        str(BASE_DIR / "yolov5"),  
        "custom",
        path=str(MODEL_PATH),
        source="local"
    )

    print("✅ Modelo YOLOv5 cargado correctamente")
    print("📌 Clases del modelo:", model.names)
except Exception as e:
    print(f"❌ Error al cargar el modelo YOLOv5: {e}")
    exit(1)

def my_adjustResultCoordinates(polys, ratio_w, ratio_h):
    new_polys = []
    for poly in polys:
        try:
            poly_arr = np.array(poly)
            if poly_arr.shape != (4, 2):
                x_min = np.min(poly_arr[:, 0])
                y_min = np.min(poly_arr[:, 1])
                x_max = np.max(poly_arr[:, 0])
                y_max = np.max(poly_arr[:, 1])
                poly_arr = np.array([[x_min, y_min],
                                     [x_max, y_min],
                                     [x_max, y_max],
                                     [x_min, y_max]])
            new_poly = poly_arr / np.array([ratio_w, ratio_h])
            new_polys.append(new_poly.tolist())
        except Exception:
            continue
    return new_polys
# Inicializa el lector easyocr que incorpore modo preba
easyocr_reader = easyocr.Reader(['es'], gpu=False)

def easyocr_text_regions(image):
    reader = easyocr.Reader(['es'], gpu=False)
    results = reader.readtext(image)
    boxes = []
    for bbox, text, confidence in results:
        xs = [p[0] for p in bbox]
        ys = [p[1] for p in bbox]
        boxes.append({
            "text": text,
            "confidence": confidence,
            "xmin": int(min(xs)),
            "ymin": int(min(ys)),
            "xmax": int(max(xs)),
            "ymax": int(max(ys)),
            "class": "ocr"
        })
    return boxes


def fix_polygon_shapes(polys):
    fixed_polys = []
    for poly in polys:
        poly_array = np.array(poly)
        # Si no es un polígono de 4 puntos [ (x1, y1), (x2, y2), (x3, y3), (x4, y4) ]
        if poly_array.shape != (4, 2):
            x_min, y_min = poly_array.min(axis=0)
            x_max, y_max = poly_array.max(axis=0)
            poly_array = np.array([
                [x_min, y_min],
                [x_max, y_min],
                [x_max, y_max],
                [x_min, y_max]
            ])
        fixed_polys.append(poly_array)
    return np.array(fixed_polys)
def allowed_file(filename):
    return ('.' in filename and 
            filename.rsplit('.', 1)[1].lower() in 
            {'png','jpg','jpeg','tiff','bmp','pdf'})

def detect_sections(image):
    try:
        results = model(image)
        df = results.pandas().xyxy[0]
        print("🔍 Detecciones YOLOv5:", df) 
        df['name'] = df['class'].apply(lambda c: classes[int(c)] if int(c) < len(classes) else f'Clase_{int(c)}')
        return df
    except Exception as e:
        print(f"Error en YOLOv5: {e}")
        return pd.DataFrame(columns=['xmin', 'ymin', 'xmax', 'ymax', 'confidence', 'class', 'name'])

def detect_sections_plan_b(image_bgr):
    """
    PLAN B: Se llama cuando 'model(image)' falla en producción.
    1) Convertir BGR a Tensor
    2) Llamar al modelo => salida bruta
    3) Non-Max-Suppression => Nx6
    4) Convertir a DataFrame => columns=[xmin,ymin,xmax,ymax,confidence,class]
       + name
    """
    if non_max_suppression is None:
        print("No se pudo importar non_max_suppression. Actualiza tu 'yolov5'.")
        # Retorna un DF vacío
        return pd.DataFrame(columns=['xmin','ymin','xmax','ymax','confidence','class','name'])

    if len(image_bgr.shape) == 3 and image_bgr.shape[2] == 3:
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    else:
        image_rgb = image_bgr
    image_rgb = cv2.resize(image_rgb, (640,640), interpolation=cv2.INTER_LINEAR)

    image_tensor = torch.from_numpy(image_rgb).float().permute(2,0,1).unsqueeze(0)/255.0

    with torch.no_grad():
        raw_preds = model(image_tensor) 

    nms = non_max_suppression(raw_preds, conf_thres=0.25, iou_thres=0.45)
    if not nms or nms[0] is None or len(nms[0])==0:
        print("Detecciones YOLOv5 (Plan B): vacio")
        df = pd.DataFrame(columns=['xmin','ymin','xmax','ymax','confidence','class','name'])
        return df

    pred = nms[0].cpu().numpy()  
    df = pd.DataFrame(
        pred, 
        columns=['xmin','ymin','xmax','ymax','confidence','class']
    )
    df['name'] = df['class'].apply(lambda c: classes.get(int(c), f'class_{int(c)}'))
    print("Detecciones YOLOv5 (Plan B) => DF:\n", df)
    return df


def assign_column(bb, x_desc_max=900, x_cant_max=1200):
    text = bb["text"].strip()
    clase = bb["class"].lower()
    x_center = (bb["xmin"] + bb["xmax"]) / 2
    if "$" in text:
        return "precio"

    if clase in ["cantidad", "cant"]:
        return "cantidad"
    elif clase in ["precio", "precio_unitario", "precio_total"]:
        return "precio"
    elif clase in ["descripcion"]:
        return "descripcion"


    if is_number(text):
       
        if '.' in text or ',' in text:
            return "precio"
        else:
            return "cantidad"

   
    if x_center < x_desc_max:
        return "descripcion"
    elif x_center < x_cant_max:
        return "cantidad"
    else:
        return "precio"
    
def is_number(text):
    return bool(re.match(r'^\d+([.,]\d+)?$', text))

def is_price(text):
    if '$' in text:
        return True
    if re.match(r'^\d+(\.\d{1,2})$', text):
        return True
    return False

def split_and_classify_text(bb):
    """
    Si un bounding box de OCR trae varios tokens,
    se separan y se asigna columna a cada uno.
    Retorna lista de sub-bboxes virtuales (misma coords, distinto texto).
    """
    text = bb["text"]
    tokens = text.split()  # divide por espacios
    sub_bboxes = []
    for tok in tokens:
       
        new_bb = bb.copy()
        new_bb["text"] = tok
        sub_bboxes.append(new_bb)
    return sub_bboxes

def group_bboxes_by_rows_and_cols(bboxes, row_tol=15, x_desc_max=900, x_cant_max=1200):
    filtered = [bb for bb in bboxes if bb["class"].lower() not in 
                ["logo", "r.u.c", "ruc", "fecha_hora", "numero_factura", "razon_social"]]
    if not filtered:
        return []
    for bb in filtered:
        bb['y_center'] = (bb['ymin'] + bb['ymax']) / 2
    bboxes_sorted = sorted(filtered, key=lambda b: b['y_center'])
    rows = []
    current_row = [bboxes_sorted[0]]
    rows.append(current_row)
    current_row_center = bboxes_sorted[0]['y_center']
    for bb in bboxes_sorted[1:]:
        if abs(bb['y_center'] - current_row_center) < row_tol:
            current_row.append(bb)
            current_row_center = sum(b['y_center'] for b in current_row) / len(current_row)
        else:
            current_row = [bb]
            rows.append(current_row)
            current_row_center = bb['y_center']
    extracted_rows = []
    for fila in rows:
        row_dict = {"descripcion": "", "cantidad": "", "precio": "", "confidence": 1.0}
        for bb in fila:
            col = assign_column(bb, x_desc_max, x_cant_max)
            if "$" in bb["text"]:
                col = "precio"
            if col == "descripcion":
                row_dict["descripcion"] += bb["text"] + " "
            elif col == "cantidad":
                row_dict["cantidad"] += bb["text"] + " "
            else:
                row_dict["precio"] += bb["text"] + " "
        row_dict["descripcion"] = row_dict["descripcion"].strip() or "No detectado"
        row_dict["cantidad"] = row_dict["cantidad"].strip() or "No detectado"
        row_dict["precio"] = row_dict["precio"].strip() or "No detectado"
        extracted_rows.append(row_dict)
    return extracted_rows


def extract_text_from_roi(image, detections):
    """
    Combina las cajas de detección obtenidas por YOLO (contenidas en 'detections')
    y las cajas extraídas por CRAFT (usando la función craft_text_regions),
    para luego agruparlas en filas y asignar columnas (descripción, cantidad, precio).
    """
    all_boxes = get_all_bboxes(image, detections)
    
    final_rows = group_bboxes_by_rows_and_cols(all_boxes, row_tol=15, x_desc_max=700, x_cant_max=1200)
    
    return final_rows


def get_all_bboxes(image_np, yolo_detections):
   
    yolo_boxes = []
    for _, row in yolo_detections.iterrows():
        x_min, y_min, x_max, y_max = map(int, [row["xmin"], row["ymin"], row["xmax"], row["ymax"]])
        yolo_boxes.append({
            "class": row["name"],
            "text": "", 
            "confidence": row["confidence"],
            "xmin": x_min,
            "ymin": y_min,
            "xmax": x_max,
            "ymax": y_max
        })

    # OCR con EasyOCR
    image_rgb = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
    ocr_boxes = easyocr_text_regions(image_rgb)

   
    expanded_ocr_boxes = []
    for box in ocr_boxes:
        expanded_ocr_boxes.extend(split_and_classify_text(box))

    return yolo_boxes + expanded_ocr_boxes


def group_with_dbscan(bboxes, eps=10, min_samples=1):
    y_centers = np.array([(bb['ymin'] + bb['ymax'])/2 for bb in bboxes]).reshape(-1, 1)
    clustering = DBSCAN(eps=eps, min_samples=min_samples).fit(y_centers)
    groups = {}
    for label, bb in zip(clustering.labels_, bboxes):
        groups.setdefault(label, []).append(bb)
    return list(groups.values())


def mark_detections(image, detections):
    if image is None or image.size == 0:
        return None
    for _, row in detections.iterrows():
        x_min, y_min, x_max, y_max = map(int, [row['xmin'], row['ymin'], row['xmax'], row['ymax']])
        class_name = row['name']
        confidence = row['confidence']
        cv2.rectangle(image, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
        cv2.putText(image, f"{class_name} ({confidence:.2f})", (x_min, y_min - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)
    return image


def image_to_base64(image):

    """Convierte la imagen a formato Base64 solo si es válida."""
    if image is None or image.size == 0:
        print("⚠ Advertencia: La imagen está vacía, se devuelve un valor por defecto.")
        return None  
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')

def preprocess_image(image):
    """Preprocesa la imagen para mejorar la detección del OCR"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)  
    thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)  
    return thresh

def detect_table(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, minLineLength=50, maxLineGap=10)
    mask = np.zeros_like(gray)
    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line[0]
            cv2.line(mask, (x1, y1), (x2, y2), 255, 2)
    kernel = np.ones((3,3), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=1)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    bounding_boxes = [cv2.boundingRect(cnt) for cnt in contours]
    bounding_boxes = sorted(bounding_boxes, key=lambda x: (x[1], x[0]))
    return bounding_boxes


def extract_text_from_table(image):
    """Extrae texto de cada celda de la tabla"""
    table_cells = detect_table(image)
    extracted_data = []
    for (x, y, w, h) in table_cells:
        roi = image[y:y+h, x:x+w]
        text = pytesseract.image_to_string(roi, config='--psm 6', lang='spa').strip()
        extracted_data.append({"x": x, "y": y, "text": text})
    return extracted_data
def normalize_text(text):
    text = re.sub(r'[^\w\d\s.,-]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def process_detected_regions(image, detections):
    """Procesa las regiones detectadas, extrayendo texto y clasificando correctamente las cantidades"""
    extracted_data = []
    detected_values = {
        "cantidad": [],
        "descripcion": []
    }

    for _, row in detections.iterrows():
        cls_id = int(row['class'])
        cls_name = classes.get(cls_id, f'class_{cls_id}')
        
        x_min, y_min, x_max, y_max = map(int, [row['xmin'], row['ymin'], row['xmax'], row['ymax']])
        roi = image[y_min:y_max, x_min:x_max]
        preprocessed_roi = preprocess_image(roi)

        try:
            text = pytesseract.image_to_string(preprocessed_roi, config='--psm 6', lang='spa').strip()
            text = normalize_text(text)

            if re.search(r'\b(Cant\.?|Cantidad)\b', text, re.IGNORECASE):
                cls_name = "cantidad"
            if re.match(r'^\d+(\.\d+)?$', text):  
                if "precio" in cls_name.lower():  
                    continue 
                cls_name = "cantidad"
                detected_values["cantidad"].append(text)
            if re.match(r'^\$\d+(\.\d+)?$', text):  
                cls_name = "precio_unitario"

            extracted_data.append({
                "class": cls_name,
                "text": text,
                "confidence": row['confidence'],  
                "bbox": [x_min, y_min, x_max, y_max]
            })

        except Exception as e:
            extracted_data.append({"class": cls_name, "text": "Error OCR", "confidence": 0.0})

    return extracted_data

@app.route('/process-document', methods=['POST'])
def process_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'El nombre del archivo está vacío'}), 400
    
    image_bgr = None
    
    if file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
        try:
            image_bgr = cv2.cvtColor(np.array(Image.open(file.stream).convert('RGB')), cv2.COLOR_RGB2BGR)
        except Exception as e:
            return jsonify({'error': f'Error procesando la imagen: {e}'}), 500
    
    elif file.filename.lower().endswith('.pdf'):
        try:
            images = convert_from_bytes(file.read())
            if not images:
                return jsonify({'error': 'No se pudo convertir el PDF en imágenes'}), 400
            image_bgr = cv2.cvtColor(np.array(images[0]), cv2.COLOR_RGB2BGR)
        except Exception as e:
            return jsonify({'error': f'Error procesando el PDF: {e}'}), 500
    else:
        return jsonify({'error': 'Tipo de archivo no soportado'}), 400

    detections = detect_sections(image_bgr)
    data = extract_text_from_roi(image_bgr, detections)
    

    marked_image = mark_detections(image_bgr, detections)
    image_base64 = image_to_base64(marked_image)

    return jsonify({'data': data, 'image': image_base64}), 200
    
@app.route('/save-document-changes', methods=['POST'])
def save_document_changes():
    try:
        req_data = request.get_json()
        print("DEBUG => req_data:", req_data)  
        rows = req_data.get("rows", [])
        invoice_number = req_data.get("invoiceNumber", "SIN_NRO")
        
        file_path = "data_invoices.json"
        print("File path =>", file_path)
        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                f.write("{}")

        with open(file_path, "r+") as f:
            existing_data = json.load(f)
            existing_data[invoice_number] = rows
            f.seek(0)
            json.dump(existing_data, f, indent=2)
            f.truncate()

        return jsonify({"message": "Cambios guardados con éxito"}), 200
    except Exception as e:
        print("Error guardando cambios:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/get-orders', methods=['GET'])
def get_orders():
    try:
        file_path = "orders.json"
        if not os.path.exists(file_path):
         
            return jsonify([]), 200

        with open(file_path, "r") as f:
            data = json.load(f)
        return jsonify(data), 200
    except Exception as e:
        print("Error al leer orders.json:", e)
        return jsonify({"error": "No se pudo cargar las órdenes"}), 500
    

@app.route("/archive-invoice", methods=["POST"])
def archive_invoice():
    try:
        raw_data = request.get_data(as_text=True)
        print("DEBUG => raw_data:", repr(raw_data))
        data = request.json
        print("DEBUG => data:", data)

        file_path = "orders.json"
      
        if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
            with open(file_path, "w") as f:
                json.dump([], f)

      
        val_total = data.get("total", 999.99)
        if val_total is None:
            val_total = 999.99  

        with open(file_path, "r+") as f:
            orders = json.load(f)
            new_id = str(uuid.uuid4())

            new_order = {
                "id": new_id,
                "fecha": data.get("fecha", "Fecha Desconocida"),
                "proveedor": data.get("proveedor", "Proveedor Desconocido"),
                "total": val_total,
                "estado": data.get("estado", "Pendiente"),
                "acciones": ["Ver Factura", "Ver Recepción"],
                "lineas": data.get("lineas", [])
            }

            orders.append(new_order)
            f.seek(0)
            json.dump(orders, f, indent=2)
            f.truncate()

        return jsonify({"message": "Factura archivada con éxito"}), 200

    except Exception as e:
        print("Error archivando factura:", e)
        return jsonify({"error": str(e)}), 500   


@app.route('/get-order/<string:order_id>', methods=['GET'])
def get_order(order_id):
    try:
        file_path = "orders.json"
        if not os.path.exists(file_path):
            return jsonify({"error": "No hay órdenes"}), 404

        with open(file_path, "r") as f:
            orders = json.load(f) 

       
        order = next((o for o in orders if o["id"] == order_id), None)
        if not order:
            return jsonify({"error": "Orden no encontrada"}), 404

        return jsonify(order), 200
    except Exception as e:
        print("Error al leer orders.json:", e)
        return jsonify({"error": str(e)}), 500
    


@app.route('/get-providers', methods=['GET'])
def get_providers():
    try:
        file_path = os.path.join(BASE_DIR, "providers.json")
        print("Buscando providers.json en:", file_path)
        if not os.path.exists(file_path):
            print("El archivo no existe, devolviendo []")
            return jsonify([]), 200

        with open(file_path, "r", encoding="utf-8") as f:
            file_content = f.read().strip().lstrip('\ufeff')
            print("Contenido de providers.json:", file_content)
            if file_content == "":
                return jsonify([]), 200
            try:
                data = json.loads(file_content)
            except Exception as parse_err:
                print("Error al parsear JSON. Contenido del archivo:", file_content)
                raise parse_err
        return jsonify(data), 200
    except Exception as e:
        print("Error al cargar proveedores:", e)
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
