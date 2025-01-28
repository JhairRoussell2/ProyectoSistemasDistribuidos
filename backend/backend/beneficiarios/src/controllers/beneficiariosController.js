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
exports.createBeneficiario = exports.getBeneficiarios = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../config/db"));
const getBeneficiarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('EXEC GetBeneficiarios'); // Nombre del procedimiento almacenado
        res.status(200).json(result[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener beneficiarios' });
    }
});
exports.getBeneficiarios = getBeneficiarios;
const schema = joi_1.default.object({
    Nombre: joi_1.default.string().max(100).required(),
    Apellido: joi_1.default.string().max(100).required(),
    Email: joi_1.default.string().email().required(),
    Telefono: joi_1.default.string().max(15).required(),
});
const createBeneficiario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        const { Nombre, Apellido, Email, Telefono } = req.body;
        yield db_1.default.query('INSERT INTO beneficiario (Nombre, Apellido, Email, Telefono) VALUES (@Nombre, @Apellido, @Email, @Telefono)', {
            Nombre,
            Apellido,
            Email,
            Telefono
        });
        res.status(201).json({ message: 'Beneficiario creado exitosamente' });
        return;
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear beneficiario' });
    }
});
exports.createBeneficiario = createBeneficiario;
