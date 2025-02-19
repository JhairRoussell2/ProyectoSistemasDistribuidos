"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const gestionReclmacionesRoutes_1 = __importDefault(require("./routes/gestionReclmacionesRoutes")); // Importa las rutas de gestion de reclamaciones
// Configurar variables de entorno
dotenv_1.default.config();
// Crear aplicación
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Registrar rutas
app.use("/gestionreclamaciones", gestionReclmacionesRoutes_1.default);
// Imprimir rutas registradas en el servidor
console.log("Rutas registradas en el servidor:");
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`- ${middleware.route.path}`);
    }
});
// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error("Middleware de error global:", err.stack);
    res.status(500).json({ error: "Error interno del servidor" });
});
exports.default = app;
