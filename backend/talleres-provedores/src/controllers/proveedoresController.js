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
                // Llamada a la función 'getallproveedores' que devuelve todos los proveedores
                const result = yield db_1.default.query("SELECT * FROM public.getallproveedores()");
                res.json(result.rows); // Acceder correctamente a 'rows'
            }
            catch (error) {
                res.status(500).json({ message: "Error al obtener los proveedores", error });
            }
        });
    }
    // Obtener proveedor por ID
    getProveedorById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                // Llamada a la función 'getproveedorbyid' para obtener el proveedor por su ID
                const result = yield db_1.default.query("SELECT * FROM public.getproveedorbyid($1)", [id]);
                // Si no se encuentra el proveedor
                if (result.rows.length === 0) {
                    res.status(404).json({ message: "Proveedor no encontrado" });
                }
                else {
                    res.json(result.rows[0]); // Retorna el primer resultado
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
            const { nombre_proveedor, direccion, telefono_proveedor, correo_electronico, tipo_proveedor, estado_proveedor, valoracion, notas } = req.body;
            try {
                // Llamada a la función 'createproveedor' para crear un nuevo proveedor
                yield db_1.default.query("SELECT public.createproveedor($1, $2, $3, $4, $5, $6, $7, $8)", [
                    nombre_proveedor,
                    direccion,
                    telefono_proveedor,
                    correo_electronico,
                    tipo_proveedor,
                    estado_proveedor,
                    valoracion,
                    notas
                ]);
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
            const { nombre_proveedor, direccion, telefono_proveedor, correo_electronico, tipo_proveedor, estado_proveedor, valoracion, notas } = req.body;
            try {
                // Llamada a la función 'updateproveedor' para actualizar los datos del proveedor
                yield db_1.default.query("SELECT public.updateproveedor($1, $2, $3, $4, $5, $6, $7, $8, $9)", [
                    id, // El ID del proveedor que se está actualizando
                    nombre_proveedor,
                    direccion,
                    telefono_proveedor,
                    correo_electronico,
                    tipo_proveedor,
                    estado_proveedor,
                    valoracion,
                    notas
                ]);
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
                // Llamada a la función 'deleteproveedor' para eliminar un proveedor
                yield db_1.default.query("SELECT public.deleteproveedor($1)", [id]);
                res.json({ message: "Proveedor eliminado correctamente" });
            }
            catch (error) {
                res.status(500).json({ message: "Error al eliminar el proveedor", error });
            }
        });
    }
}
exports.default = new ProveedoresController();
