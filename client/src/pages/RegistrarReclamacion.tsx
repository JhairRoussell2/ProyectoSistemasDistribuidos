import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerSiniestrosPorUsuario,
  registrarReclamacion,
} from "../services/apiReclamaciones";
import { IoMdArrowBack } from "react-icons/io";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";
import "react-toastify/dist/ReactToastify.css"; // Importamos estilos de Toastify
import { toast, ToastContainer } from "react-toastify";

const RegistrarReclamacion = () => {
  const navigate = useNavigate();
  const [siniestros, setSiniestros] = useState<
    { siniestroid: number; descripcion: string }[]
  >([]);
  const [siniestroid, setSiniestroid] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [documentos, setDocumentos] = useState<FileList | null>(null);
  const [alerta, setAlerta] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [usuarioID, setUsuarioID] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ Obtener usuarioID desde localStorage al inicio
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log("✅ Usuario cargado desde localStorage:", userData);
        setUsuarioID(userData.UsuarioID || null);
      }
    } catch (error) {
      console.error("❌ Error al parsear usuario desde localStorage:", error);
    }
  }, []);

  // ✅ Cargar siniestros cuando usuarioID esté disponible
  useEffect(() => {
    if (!usuarioID) return;

    const fetchSiniestros = async () => {
      try {
        console.log(`🔍 Buscando siniestros para usuarioID: ${usuarioID}`);
        const siniestrosData = await obtenerSiniestrosPorUsuario(usuarioID);
        setSiniestros(Array.isArray(siniestrosData) ? siniestrosData : []);
      } catch (error) {
        setAlerta({ message: "Error al cargar siniestros.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchSiniestros();
  }, [usuarioID]);

  // ✅ Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !siniestroid ||
      !tipo ||
      !descripcion ||
      !documentos ||
      documentos.length === 0
    ) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("siniestroid", siniestroid);
      formData.append("estado", "Pendiente");
      formData.append("descripcion", descripcion);
      formData.append("tipo", tipo);

      // 📌 **Adjuntar archivos correctamente**
      Array.from(documentos).forEach((file) => {
        formData.append("documentos", file);
      });

      // 📌 **Enviar todo en una sola petición**
      const response = await registrarReclamacion(formData);

      toast.success("¡Reclamación registrada con éxito! 🎉");

      // 🔹 Redirigir después de 2 segundos
      setModalVisible(true);
    } catch (error) {
      setAlerta({
        message: "Error al registrar la reclamación.",
        type: "error",
      });
    }
  };

  if (!usuarioID) {
    return (
      <p className="text-red-500 text-center mt-10">
        Cargando datos del usuario...
      </p>
    );
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    // 📌 Convertir FileList a un array
    const filesArray = Array.from(selectedFiles);

    // 📌 Definir formatos permitidos
    const allowedFormats = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "image/jpg",
    ];

    // 📌 Verificar si hay más de 5 archivos
    if (filesArray.length > 5) {
      toast.error("Solo puedes subir un máximo de 5 archivos.");
      e.target.value = "";
      return;
    }

    // 📌 Verificar que todos los archivos sean del tipo permitido
    const invalidFiles = filesArray.filter(
      (file) => !allowedFormats.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Solo se permiten archivos PDF, JPG, JPEG y PNG.");
      e.target.value = ""; // 🔹 Reinicia la selección de archivos

      return;
    }

    // 📌 Si pasa todas las validaciones, actualiza el estado
    setDocumentos(selectedFiles);
  };

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      {/* 🔹 MODAL de Confirmación */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-transparent">
          <div
            className="p-6 w-[400px] text-center rounded-lg shadow-lg 
    backdrop-blur-md bg-white/30 border border-white/20"
          >
            <h2 className="text-2xl font-semibold text-red-600">
              🎉 ¡Registro Exitoso!
            </h2>
            <p className="text-gray-700 mt-2">
              ¿Deseas registrar otra reclamación o regresar al dashboard?
            </p>

            <div className="flex justify-between mt-6">
              {/* Botón de Registrar otra reclamación */}
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 w-[45%]"
                onClick={() => {
                  setModalVisible(false);
                  setSiniestroid("");
                  setTipo("");
                  setDescripcion("");
                  setDocumentos(null);
                }}
              >
                Nueva
              </button>

              {/* Botón de Volver al Dashboard */}
              <button
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 w-[45%]"
                onClick={() => navigate("/dashboard/general")}
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-red-200 to-red-300 p-20">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          {/* 🔹 Título con icono */}
          <h2 className="text-5xl font-bold text-red-700 flex items-center justify-center gap-2">
            <span className="text-4xl">📄</span> Ingresar Reclamación
          </h2>
          <p className="text-gray-600 text-center">
            Completa los datos para registrar una reclamación.
          </p>

          {alerta && (
            <Alert
              type={alerta.type}
              message={alerta.message}
              onClose={() => setAlerta(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 🔹 Siniestro */}
            <label className="block font-medium text-gray-800 flex items-center gap-2">
              📄 Siniestro
            </label>
            <select
              value={siniestroid}
              onChange={(e) => setSiniestroid(e.target.value)}
              className="border border-gray-300 p-3 w-full rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
              required
              disabled={loading}
            >
              <option value="">Seleccione un siniestro</option>
              {loading ? (
                <option disabled>Cargando siniestros...</option>
              ) : siniestros.length > 0 ? (
                siniestros.map((siniestro) => (
                  <option
                    key={siniestro.siniestroid}
                    value={siniestro.siniestroid}
                  >
                    {`ID: ${siniestro.siniestroid} - ${siniestro.descripcion}`}
                  </option>
                ))
              ) : (
                <option disabled>No hay siniestros disponibles</option>
              )}
            </select>

            {/* 🔹 Tipo de Reclamación */}
            <label className="block font-medium text-gray-800 flex items-center gap-2">
              🔍 Tipo de Reclamación
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="border border-gray-300 p-3 w-full rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Seleccione un tipo de reclamación</option>
              <option value="Daño Material">Daño Material</option>
              <option value="Robo Total">Robo Total</option>
              <option value="Lesiones Personales">Lesiones Personales</option>
              <option value="Otros">Otros</option>
            </select>

            {/* 🔹 Descripción */}
            <label className="block font-medium text-gray-800 flex items-center gap-2">
              📝 Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Escriba los detalles de su reclamación..."
              className="border border-gray-300 p-3 w-full rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
              required
            />

            {/* 🔹 Subir Documentos */}
            <label className="block font-medium text-gray-800 flex items-center gap-2">
              📎 Subir Documentos ✅ <strong>Formatos permitidos:</strong> PDF,
              JPG, JPEG, PNG.
              <strong>Máximo:</strong> 5 archivos.
            </label>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              className="border border-gray-300 p-3 w-full rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
              required
            />

            <div className="flex justify-between mt-8">
              {/* 🔹 Botón de Registrar Reclamación (Rojo, Izquierda) */}
              <button
                type="submit"
                className="bg-[#e3342f] hover:bg-[#cc1f1a] text-white px-12 py-3 w-80 rounded-lg font-semibold shadow-md transition-all duration-300"
                
              >
                Registrar Reclamación
              </button>

              {/* 🔹 Botón de Regresar al Dashboard (Negro, Derecha) */}
              <button
                type="button"
                className="bg-[#1f2937] hover:bg-[#111827] text-white px-12 py-3 w-80 rounded-lg font-semibold flex items-center justify-center shadow-md transition-all duration-300"
                onClick={() => navigate("/dashboard/general")}
                
              >
                <IoMdArrowBack className="mr-2 text-lg" /> Regresar al Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrarReclamacion;
