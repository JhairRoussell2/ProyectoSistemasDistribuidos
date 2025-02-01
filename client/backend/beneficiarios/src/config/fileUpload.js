"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configuración de almacenamiento de Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Puedes modificar la ruta donde se almacenan los archivos subidos
        cb(null, './uploads'); // Crear carpeta 'uploads' en el directorio principal
    },
    filename: (req, file, cb) => {
        // El nombre del archivo se genera dinámicamente con la fecha y extensión original
        const ext = path_1.default.extname(file.originalname);
        cb(null, Date.now() + ext); // Nombre único para evitar colisiones
    },
});
// Definir las configuraciones de Multer
const upload = (0, multer_1.default)({
    storage: storage,
    // Puedes agregar otras validaciones, como el tamaño máximo del archivo
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
        // Validar el tipo de archivo (puedes modificar esto)
        const fileTypes = /jpg|jpeg|png|gif|pdf/;
        const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        else {
            cb(new Error('Solo se permiten imágenes o archivos PDF.'));
        }
    },
});
// Exportar la configuración para que la uses en tus rutas
exports.default = upload;
