"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyProductsStrapi = exports.updateProductInStrapi = exports.createProductInStrapi = exports.getProductFromStrapi = exports.getAllProductsStrapi = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '.env' });
const STRAPI_URL = process.env.STRAPI_URL;
const getAllProductsStrapi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        // Realiza la solicitud GET al endpoint de productos en Strapi
        const response = yield axios_1.default.get(`${STRAPI_URL}/products`, {
            headers: {
                //'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`, // Si Strapi usa autenticación JWT
                'Content-Type': 'application/json',
            },
            params: {
                populate: ['category'],
                filters: { user: userId }
            }
        });
        // Retorna los productos obtenidos de Strapi
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error('Error fetching products from Strapi:', error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
});
exports.getAllProductsStrapi = getAllProductsStrapi;
const getProductFromStrapi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId } = req.params;
    try {
        // Hacer la solicitud a Strapi usando el id como número
        const response = yield axios_1.default.get(`${STRAPI_URL}/products/`, {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                populate: {
                    category: true,
                    //store: true
                },
                filters: {
                    user: {
                        userId
                    },
                    documentId: productId // Filtro adicional por el ID del producto
                }
            }
        });
        if (response.status !== 200) {
            res.status(404).json({ message: 'Producto no encontrado en Strapi' });
            return;
        }
        res.status(200).json(response.data.data); // Enviar el producto encontrado
    }
    catch (error) {
        console.error('Error al obtener el producto de Strapi:', error);
        res.status(500).json({ message: 'Error al obtener el producto de Strapi' });
    }
});
exports.getProductFromStrapi = getProductFromStrapi;
const createProductInStrapi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, barcode, stock, inventoryAlert, inventoryAlertCount, category, customFeatures } = req.body.data;
    const { userId } = req.params;
    const token = req.headers['authorization'];
    const user = String(userId);
    if (!token) {
        res.status(400).json({ message: 'Token de autenticación requerido' });
        return;
    }
    try {
        // Preparar los datos para enviar a Strapi
        const productData = {
            data: {
                name,
                description,
                price,
                barcode,
                stock,
                inventoryAlert,
                inventoryAlertCount,
                user,
                category: { connect: category },
                customFeatures: customFeatures
            }
        };
        // Opciones de encabezado, incluyendo el token de autenticación si es necesario
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
        };
        // Enviar el producto a Strapi
        const response = yield axios_1.default.post(`${STRAPI_URL}/products`, productData, config);
        res.status(201).json({
            message: 'Producto creado en Strapi con éxito',
            data: response.data
        });
    }
    catch (error) {
        console.error('Error al crear producto en Strapi:', error);
        res.status(500).json({ error: 'Error al crear el producto en Strapi' });
    }
});
exports.createProductInStrapi = createProductInStrapi;
const updateProductInStrapi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // ID del producto desde los parámetros de la URL
    const updatedData = req.body; // Datos para actualizar, recibidos en el cuerpo de la solicitud
    const token = req.headers['authorization'];
    try {
        // Preparar el objeto con formato adecuado para Strapi
        const productData = {
            data: Object.assign({}, updatedData),
        };
        // Añadir relación con `store` si se envía en los datos
        if (updatedData.store && updatedData.store.id) {
            productData.data.store = { id: updatedData.store.id };
        }
        // Añadir relación con `category` si se envía en los datos
        if (updatedData.category && updatedData.category.id) {
            productData.data.category = { id: updatedData.category.id };
        }
        // Realizar la solicitud PUT a la API de Strapi para actualizar el producto por ID
        const response = yield axios_1.default.put(`${STRAPI_URL}/products/${id}`, productData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token, // Agrega el token si Strapi usa autenticación
            },
        });
        // Retorna el producto actualizado en la respuesta
        res.status(200).json({
            message: 'Producto actualizado con éxito',
            data: response.data,
        });
    }
    catch (error) {
        console.error('Error al actualizar el producto en Strapi:', error);
        res.status(500).json({ message: 'Error al actualizar el producto en Strapi', error });
    }
});
exports.updateProductInStrapi = updateProductInStrapi;
const buyProductsStrapi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { products } = req.body; // Obtenemos los productos y cantidades desde el cuerpo de la solicitud
    let alerts = []; // Array para almacenar las alertas
    try {
        // Validar el stock para cada producto
        const stockChecks = yield Promise.all(products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const { productId, quantity } = item;
            // Llamar a la función para validar el stock
            const isStock = yield validateStockStrapi(productId, quantity);
            // Si no hay suficiente stock, lanzar un error
            if (!isStock.status) {
                throw new Error(`Stock insuficiente del producto ${isStock.product.name}`);
            }
            return isStock.product.stock; // Retornar el stock actual
        })));
        // Reducir el stock de los productos en función de las cantidades compradas
        yield Promise.all(products.map((item, index) => {
            const { productId, quantity } = item;
            const currentStock = stockChecks[index]; // El stock validado previamente
            return reduceStockStrapi(productId, quantity, currentStock); // Reducir el stock
        }));
        // Enviar alertas si algún producto tiene stock bajo
        const alertMessages = yield Promise.all(products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            return yield alertStockStrapi(item.productId); // Comprobar si se necesita una alerta
        })));
        // Filtrar las alertas no definidas
        alerts = alertMessages.filter(alert => alert !== undefined);
        // Responder al cliente con un mensaje de éxito y las alertas si las hay
        res.status(200).json(Object.assign({ message: 'Compra confirmada' }, (alerts.length > 0 && { alerts }) // Incluir las alertas solo si existen
        ));
    }
    catch (error) {
        // Manejo de errores: Si algo falla, responder con un mensaje de error
        console.log(error.message);
        res.status(500).json({ message: 'Error al confirmar la compra', error: error.message });
    }
});
exports.buyProductsStrapi = buyProductsStrapi;
const reduceStockStrapi = (productId, quantity, currentStock) => __awaiter(void 0, void 0, void 0, function* () {
    const newStock = Number(currentStock) - Number(quantity);
    const updatedData = {
        stock: newStock,
    };
    try {
        const response = yield axios_1.default.put(`${STRAPI_URL}/products/${productId}`, {
            data: updatedData, // Actualización del stock
        }, {
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`, // Si es necesario un token de autenticación
            },
        });
    }
    catch (error) {
        console.error('Error al actualizar el stock en Strapi:', error);
    }
});
const validateStockStrapi = (productId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Realizar la solicitud GET a la API de Strapi para obtener el producto por ID
        const response = yield axios_1.default.get(`${STRAPI_URL}/products/${productId}`, {
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`, // Si se requiere un token de autenticación
            }
        });
        const product = response.data.data; // Aquí obtenemos los datos del producto
        // Validamos si el stock es suficiente para la cantidad requerida
        if (product.stock < quantity) {
            return { status: false, product };
        }
        return { status: true, product };
    }
    catch (error) {
        console.error('Error al validar el stock en Strapi:', error);
        return { status: false, message: 'Error al obtener el producto' };
    }
});
const alertStockStrapi = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Realizar una solicitud GET a la API de Strapi para obtener el producto
        const response = yield axios_1.default.get(`${STRAPI_URL}/products/${productId}`, {
            headers: {
                'Content-Type': 'application/json',
                // Agregar token de autenticación si es necesario
                // 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
            }
        });
        const product = response.data.data;
        // Verificar si el producto tiene activada la alerta de inventario y si el stock es bajo
        if ((product === null || product === void 0 ? void 0 : product.inventoryAlert) == true && (product === null || product === void 0 ? void 0 : product.stock) <= (product === null || product === void 0 ? void 0 : product.inventoryAlertCount)) {
            return `El producto ${product.name} tiene bajo inventario. Solo quedan ${product.stock} unidades.`;
        }
        // Si no es necesario alertar, retornar undefined
        return undefined;
    }
    catch (error) {
        console.error('Error al consultar el stock del producto:', error);
        throw new Error('Error al obtener el stock del producto.');
    }
});
