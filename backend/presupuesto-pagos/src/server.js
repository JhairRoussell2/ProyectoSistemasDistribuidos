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
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const PORT = process.env.PORT || 5001;
db_1.default.connect()
    .then((client) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Conectado a la base de datos PostgreSQL");
    // Consulta para obtener las tablas disponibles
    try {
        const result = yield client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tablas disponibles en la base de datos:");
        result.rows.forEach((row) => {
            console.log(`- ${row.table_name}`); // Mostrar los nombres de las tablas
        });
    }
    catch (error) {
        console.error("Error al obtener las tablas:", error);
    }
    finally {
        client.release(); // Liberar la conexión al pool
    }
    // Iniciar el servidor
    app_1.default.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}))
    .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
});
