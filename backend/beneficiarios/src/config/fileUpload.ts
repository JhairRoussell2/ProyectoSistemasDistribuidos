import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Puedes modificar la ruta donde se almacenan los archivos subidos
    cb(null, './uploads'); // Crear carpeta 'uploads' en el directorio principal
  },
  filename: (req, file, cb) => {
    // El nombre del archivo se genera dinámicamente con la fecha y extensión original
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nombre único para evitar colisiones
  },
});

// Definir las configuraciones de Multer
const upload = multer({
  storage: storage,
  // Puedes agregar otras validaciones, como el tamaño máximo del archivo
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    // Validar el tipo de archivo (puedes modificar esto)
    const fileTypes = /jpg|jpeg|png|gif|pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes o archivos PDF.'));
    }
  },
});

// Exportar la configuración para que la uses en tus rutas
export default upload;
