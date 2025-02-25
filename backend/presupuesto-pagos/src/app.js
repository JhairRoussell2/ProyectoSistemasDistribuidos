"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const presupuestoPagosRoutes_1 = __importDefault(require("./routes/presupuestoPagosRoutes"));
const GenerarReporteRoutes_1 = __importDefault(require("./routes/GenerarReporteRoutes"));
// Configurar variables de entorno
dotenv_1.default.config();
// Crear aplicación
const app = (0, express_1.default)();
// Definir los tipos de archivos permitidos (imágenes y PDF)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const mimeType = allowedTypes.test(file.mimetype);
    if (mimeType) {
        cb(null, true); // Aceptar el archivo
    }
    else {
        cb(new Error("Tipo de archivo no permitido. Solo imágenes y PDFs."), false); // Rechazar el archivo
    }
};
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Registrar rutas
//app.use("/api/proveedores", presupuestoPagosRoutes);
app.use("/api/presupuesto-pagos", presupuestoPagosRoutes_1.default);
app.use("/api/GenerarReporte", GenerarReporteRoutes_1.default);
// Imprimir rutas registradas en el servidor
console.log("Rutas registradas en el servidor:");
const getRoutes = (layer, basePath = "") => {
    if (layer.route) {
        // Si es una ruta directa, mostrar el path
        console.log(`- ${basePath}${layer.route.path}`);
    }
    else if (layer.name === "router" && layer.handle.stack) {
        // Si es un router con subrutas
        layer.handle.stack.forEach((subLayer) => {
            let cleanedPath = layer.regexp.source
                .replace(/^\^/, "") // Eliminar el `^` del inicio
                .replace(/\\\//g, "/") // Reemplazar `\/` por `/`
                .replace(/\(\?=\/\|\$\)/, "") // Eliminar `(?=\/|$)`
                .replace(/\?\//g, "/") // Eliminar `?/` extra
                .replace(/\/\?$/, ""); // Eliminar `/?` del final
            getRoutes(subLayer, basePath + cleanedPath);
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
