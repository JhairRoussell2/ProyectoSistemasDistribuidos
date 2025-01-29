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
class ProveedoresController {
    // Obtener todos los proveedores
    getProveedores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query("CALL GetAllProveedores()");
                res.json(rows);
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener los proveedores", error });
            }
        });
    }
    getProveedorById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const [result] = yield db_1.default.query("CALL GetProveedorById(?)", [id]);
                // MySQL devuelve los resultados en un array anidado cuando se usa CALL
                const rows = result[0];
                if (rows.length > 0) {
                    res.json(rows[0]); // Retorna el primer resultado
                }
                else {
                    res.status(404).json({ message: "Proveedor no encontrado" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener el proveedor", error });
            }
        });
    }
    // Crear un nuevo proveedor
    createProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Nombre_Proveedor, Dirección, Teléfono_Proveedor, Correo_Electrónico, Tipo_Proveedor, Estado_Proveedor, Valoración, Notas } = req.body;
            try {
                yield db_1.default.query("CALL CreateProveedor(?, ?, ?, ?, ?, ?, ?, ?)", [Nombre_Proveedor, Dirección, Teléfono_Proveedor, Correo_Electrónico, Tipo_Proveedor, Estado_Proveedor, Valoración, Notas]);
                res.json({ message: "Proveedor creado correctamente" });
            }
            catch (error) {
                res.status(500).json({ message: "Error al crear el proveedor", error });
            }
        });
    }
    // Actualizar un proveedor
    updateProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { Nombre_Proveedor, Dirección, Teléfono_Proveedor, Correo_Electrónico, Tipo_Proveedor, Estado_Proveedor, Valoración, Notas } = req.body;
            try {
                yield db_1.default.query("CALL UpdateProveedor(?, ?, ?, ?, ?, ?, ?, ?, ?)", [id, Nombre_Proveedor, Dirección, Teléfono_Proveedor, Correo_Electrónico, Tipo_Proveedor, Estado_Proveedor, Valoración, Notas]);
                res.json({ message: "Proveedor actualizado correctamente" });
            }
            catch (error) {
                res.status(500).json({ message: "Error al actualizar el proveedor", error });
            }
        });
    }
    // Eliminar un proveedor
    deleteProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield db_1.default.query("CALL DeleteProveedor(?)", [id]);
                res.json({ message: "Proveedor eliminado correctamente" });
            }
            catch (error) {
                res.status(500).json({ message: "Error al eliminar el proveedor", error });
            }
        });
    }
}
exports.default = new ProveedoresController();
