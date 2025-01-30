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
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const siniestrosRoutes_1 = __importDefault(require("./routes/siniestrosRoutes"));
const beneficiariosRoutes_1 = __importDefault(require("./routes/beneficiariosRoutes"));
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
// Rutas
app.use("/api/beneficiarios", beneficiariosRoutes_1.default);
app.use("/api/siniestros", siniestrosRoutes_1.default);
// Ruta para cargar imágenes a Cloudinary
app.post("/upload", upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).send("No file uploaded.");
            return;
        }
        // Subir el archivo a Cloudinary
        const result = yield cloudinary_1.default.v2.uploader.upload(req.file.path, {
            folder: "Siniestros"
        });
        // Enviar la URL del archivo subido a Cloudinary como respuesta
        res.status(200).json(result); // Devolver la respuesta con la URL del archivo subido
    }
    catch (error) {
        // En caso de error, se maneja adecuadamente
        res.status(400).send("Error al cargar el archivo.");
    }
}));
exports.default = app;
