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
    // Obtener todos los talleres con el nombre del proveedor
    getTalleres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query(`
        SELECT t.tallerid, t.nombre, t.direccion, t.capacidad, t.estado, t.telefono, 
               p.nombre_proveedor AS proveedor_nombre, p.id_proveedor AS proveedor_id
        FROM taller t
        JOIN proveedores p ON t.proveedor_id = p.id_proveedor
      `);
                res.json(result.rows);
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener los talleres", error });
            }
        });
    }
    // Obtener un taller por ID con el nombre del proveedor
    getTallerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const result = yield db_1.default.query(`
        SELECT t.tallerid, t.nombre, t.direccion, t.capacidad, t.estado, t.telefono, 
               p.nombre_proveedor AS proveedor_nombre, p.id_proveedor AS proveedor_id
        FROM taller t
        JOIN proveedores p ON t.proveedor_id = p.id_proveedor
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
    // Crear un nuevo taller (con proveedor)
    createTaller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, direccion, capacidad, telefono, proveedor_id } = req.body;
            const estado = "Disponible"; // Estado por defecto
            try {
                yield db_1.default.query("INSERT INTO taller (nombre, direccion, capacidad, estado, telefono, proveedor_id) VALUES ($1, $2, $3, $4, $5, $6)", [nombre, direccion, capacidad, estado, telefono, proveedor_id]);
                res.json({ message: "Taller creado correctamente" });
            }
            catch (error) {
                res.status(500).json({ message: "Error al crear el taller", error });
            }
        });
    }
    // Actualizar un taller (incluyendo proveedor)
    updateTaller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { nombre, direccion, capacidad, estado, telefono, proveedor_id } = req.body;
            try {
                yield db_1.default.query("UPDATE taller SET nombre = $1, direccion = $2, capacidad = $3, estado = $4, telefono = $5, proveedor_id = $6 WHERE tallerid = $7", [nombre, direccion, capacidad, estado, telefono, proveedor_id, id]);
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
