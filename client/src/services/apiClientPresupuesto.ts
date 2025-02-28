import axios from "axios";

// Definir la URL base para el backend de presupuestos
const API_PRESUPUESTOS_URL =
  import.meta.env.VITE_API_PRESUPUESTOS_URL || "http://localhost:5002/api/presupuestos-pagos";

const apiClientPresupuestos = axios.create({
  baseURL: API_PRESUPUESTOS_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Límite de tiempo para solicitudes (10 segundos)
});

export default apiClientPresupuestos;
