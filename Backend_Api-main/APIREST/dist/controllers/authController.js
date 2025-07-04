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
exports.login = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '.env' });
const STRAPI_URL = process.env.STRAPI_URL;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier, password } = req.body; // Recibe el email o username y la contraseña del usuario
    try {
        // Enviar la solicitud de autenticación a Strapi
        const response = yield axios_1.default.post(`${STRAPI_URL}/auth/local`, {
            identifier,
            password,
        });
        console.log(response.data);
        const { jwt } = response.data; // Obtiene el JWT (token)
        //const {id}
        // Enviar el token como respuesta
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token: jwt,
        });
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(400).json({
            message: 'Credenciales incorrectas',
        });
    }
});
exports.login = login;
