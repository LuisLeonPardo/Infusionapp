"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'T2u8vHBIfXAz7ZOBrZNDPw==';
const getUserIdFromToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Authentication token is required' });
    }
    else {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.params.userId = String(decoded.id);
            //req.body.data.userId = decoded.id ;
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
};
exports.getUserIdFromToken = getUserIdFromToken;
