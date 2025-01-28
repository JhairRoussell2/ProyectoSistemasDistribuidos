"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jwt_1 = require("../utils/jwt");
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Acceso no autorizado' });
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.body.user = decoded;
        next();
    }
    catch (_b) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};
exports.verifyToken = verifyToken;
