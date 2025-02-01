"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
//import siniestrosRoutes from "./routes/tallerRoutes";// para talleres proximamente 
const proveedoresRoutes_1 = __importDefault(require("./routes/proveedoresRoutes"));
// Configurar variables de entorno
dotenv_1.default.config();
// Crear aplicación
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Registrar rutas
app.use("/api/proveedores", proveedoresRoutes_1.default);
// Imprimir rutas registradas en el servidor
console.log("Rutas registradas en el servidor:");
const getRoutes = (layer, basePath = "") => {
    if (layer.route) {
        // Ruta directa
        console.log(`- ${basePath}${layer.route.path}`);
    }
    else if (layer.name === "router" && layer.handle.stack) {
        // Subrutas dentro de un router
        layer.handle.stack.forEach((subLayer) => {
            getRoutes(subLayer, basePath + (layer.regexp.source.replace("\\/", "/").replace("^", "").replace("?$", "")));
        });
    }
};
app._router.stack.forEach((middleware) => {
    getRoutes(middleware);
});
// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error("Middleware de error global:", err.stack);
    res.status(500).json({ error: "Error interno del servidor" });
});
exports.default = app;
