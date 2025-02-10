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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = __importDefault(require("cloudinary"));
//import siniestrosRoutes from "./routes/tallerRoutes";// para talleres proximamente 
const TalleresRoutes_1 = __importDefault(require("./routes/TalleresRoutes"));
const proveedoresRoutes_1 = __importDefault(require("./routes/proveedoresRoutes"));
const multer_1 = __importDefault(require("multer"));
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
// Configurar Multer para cargar archivos
const upload = (0, multer_1.default)({
    dest: 'uploads/', // Directorio temporal
    fileFilter: fileFilter
});
// Configurar Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Registrar rutas
app.use("/api/proveedores", proveedoresRoutes_1.default);
app.use("/api/talleres", TalleresRoutes_1.default);
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
// ✅ Ruta para cargar imágenes a Cloudinary
app.post("/upload", upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).send("No file uploaded.");
            return;
        }
        // Subir el archivo a Cloudinary
        const result = yield cloudinary_1.default.v2.uploader.upload(req.file.path, {
            folder: "Proveedores", // Carpeta en Cloudinary
        });
        // Enviar la URL del archivo subido a Cloudinary como respuesta
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).send("Error al cargar el archivo.");
    }
}));
exports.default = app;
