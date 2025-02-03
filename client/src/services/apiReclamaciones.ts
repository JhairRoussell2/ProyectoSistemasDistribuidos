import axios from "axios";

const API_URL = "http://localhost:3000/api/reclamaciones";

// ✅ Obtener siniestros de un usuario
export const obtenerSiniestrosPorUsuario = async (usuarioID: number) => {
  try {
    const response = await axios.get(`${API_URL}/siniestros/${usuarioID}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo siniestros:", error);
    return [];
  }
};

// ✅ Registrar una nueva reclamación con documentos (en una sola petición)
export const registrarReclamacion = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Necesario para enviar archivos
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error registrando la reclamación:", error);
    throw error;
  }
};
