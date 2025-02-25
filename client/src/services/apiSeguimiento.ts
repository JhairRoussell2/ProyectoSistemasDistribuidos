import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SEGUIMIENTO_URL || "http://localhost:3000/api/seguimiento"; // Ajusta la URL según tu entorno


// 📌 Obtener siniestros de un 
export const obtenerSiniestrosBeneficiario = async (usuarioid: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/siniestros/beneficiario/${usuarioid}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener siniestros del beneficiario:", error);
    throw error;
  }
};

// 📌 Obtener detalle completo de un siniestro
export const obtenerDetalleSiniestroCompleto = async (siniestroid: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/siniestro/${siniestroid}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalles del siniestro:", error);
    throw error;
  }
};