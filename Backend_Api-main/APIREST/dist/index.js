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
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
/* import categoryRoutes from './routes/categoryRoutes' */
const dotenv_1 = require("dotenv");
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
(0, dotenv_1.config)({ path: '.env' });
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use('/api/products', productRoutes_1.default);
/* app.use('/api/categories', categoryRoutes) */
app.use('/api/invoices', invoiceRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    app.listen(PORT, () => {
        console.log('Server running on localhost 4000');
    });
});
startServer();
