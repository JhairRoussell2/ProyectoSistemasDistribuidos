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
const db_1 = __importDefault(require("../config/db"));
class TalleresController {
    // Obtener todos los talleres con sus proveedores (muchos a muchos)
    getTalleres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query(`
        SELECT t.tallerid, t.nombre, t.direccion, t.capacidad, t.estado, t.telefono,
               (
                 SELECT json_agg(
                          json_build_object(
                            'proveedor_id', p.id_proveedor,
                            'proveedor_nombre', p.nombre_proveedor
                          )
                        )
                 FROM talleres_proveedores tp
                 JOIN proveedores p ON tp.proveedor_id = p.id_proveedor
                 WHERE tp.taller_id = t.tallerid
               ) AS proveedores
        FROM taller t
      `);
                res.json(result.rows);
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener los talleres", error });
            }
        });
    }
    // Obtener un taller por ID con sus proveedores
    getTallerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const result = yield db_1.default.query(`
        SELECT t.tallerid, t.nombre, t.direccion, t.capacidad, t.estado, t.telefono,t.estadoactual,
               (
                 SELECT json_agg(
                          json_build_object(
                            'proveedor_id', p.id_proveedor,
                            'proveedor_nombre', p.nombre_proveedor
                          )
                        )
                 FROM talleres_proveedores tp
                 JOIN proveedores p ON tp.proveedor_id = p.id_proveedor
                 WHERE tp.taller_id = t.tallerid
               ) AS proveedores
        FROM taller t
        WHERE t.tallerid = $1
      `, [id]);
                if (result.rows.length === 0) {
                    res.status(404).json({ message: "Taller no encontrado" });
                }
                else {
                    res.json(result.rows[0]);
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener el taller", error });
            }
        });
    }
    // Crear un nuevo taller (con múltiples proveedores)
    createTaller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, direccion, capacidad, telefono, proveedores } = req.body;
            const estado = "Disponible"; // Estado por defecto
            try {
                // Insertar el taller y obtener su ID
                const result = yield db_1.default.query("INSERT INTO taller (nombre, direccion, capacidad, estado, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING tallerid", [nombre, direccion, capacidad, estado, telefono]);
                const tallerId = result.rows[0].tallerid;
                // Insertar las asociaciones en la tabla intermedia, si se proporcionaron proveedores
                if (proveedores && Array.isArray(proveedores)) {
                    for (const proveedorId of proveedores) {
                        yield db_1.default.query("INSERT INTO talleres_proveedores (taller_id, proveedor_id) VALUES ($1, $2)", [tallerId, proveedorId]);
                    }
                }
                res.json({ message: "Taller creado correctamente" });
            }
            catch (error) {
                res.status(500).json({ message: "Error al crear el taller", error });
            }
        });
    }
    // Actualizar un taller y sus asociaciones de proveedores
    updateTaller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { nombre, direccion, capacidad, estado, telefono, proveedores } = req.body;
            try {
                // Actualizar los datos básicos del taller
                yield db_1.default.query("UPDATE taller SET nombre = $1, direccion = $2, capacidad = $3, estado = $4, telefono = $5 WHERE tallerid = $6", [nombre, direccion, capacidad, estado, telefono, id]);
                // Eliminar las asociaciones existentes en la tabla intermedia para este taller
                yield db_1.default.query("DELETE FROM talleres_proveedores WHERE taller_id = $1", [id]);
                // Insertar las nuevas asociaciones
                if (proveedores && Array.isArray(proveedores)) {
                    for (const proveedorId of proveedores) {
                        yield db_1.default.query("INSERT INTO talleres_proveedores (taller_id, proveedor_id) VALUES ($1, $2)", [id, proveedorId]);
                    }
                }
                res.json({ message: "Taller actualizado correctamente" });
            }
            catch (error) {
                res.status(500).json({ message: "Error al actualizar el taller", error });
            }
        });
    }
    // Eliminar un taller
    deleteTaller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                // Verificar si el taller tiene siniestros asignados usando el campo estadoactual
                const result = yield db_1.default.query("SELECT estadoactual FROM taller WHERE tallerid = $1", [id]);
                if (result.rows.length === 0) {
                    res.status(404).json({ message: "Taller no encontrado" });
                }
                const estadoActual = result.rows[0].estadoactual;
                // Si el contador de siniestros es mayor que 0, no se puede eliminar el taller
                if (estadoActual > 0) {
                    res.status(400).json({ message: "No se puede eliminar el taller porque tiene siniestros asignados." });
                    return;
                }
                // Si no tiene siniestros, proceder con la eliminación
                yield db_1.default.query("DELETE FROM taller WHERE tallerid = $1", [id]);
                res.json({ message: "Taller eliminado correctamente" });
            }
            catch (error) {
                res.status(500).json({ message: "Error al eliminar el taller", error });
            }
        });
    }
}
exports.default = new TalleresController();
