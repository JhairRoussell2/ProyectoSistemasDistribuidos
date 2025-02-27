import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerSiniestrosBeneficiario } from "../services/apiSeguimiento";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowBack } from "react-icons/io";

const SeguimientoSiniestros = () => {
  const navigate = useNavigate();
  const [siniestros, setSiniestros] = useState<any[]>([]);
  const [usuarioID, setUsuarioID] = useState<number | null>(null);
  const [alerta, setAlerta] = useState<any>(null);
  const [siniestroSeleccionado, setSiniestroSeleccionado] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUsuarioID(userData.UsuarioID || null);
    }
  }, []);

  useEffect(() => {
    if (!usuarioID) return;

    const fetchSiniestros = async () => {
      try {
        const siniestrosData = await obtenerSiniestrosBeneficiario(
          usuarioID.toString()
        );
        setSiniestros(siniestrosData);
      } catch (error) {
        setAlerta({ message: "Error al cargar siniestros.", type: "error" });
      } finally {
      }
    };

    fetchSiniestros();
  }, [usuarioID]);

  const handleSiniestroSeleccionado = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const siniestroId = e.target.value;
    if (siniestroId) {
      setSiniestroSeleccionado(siniestroId);
    }
  };

  const handleVerSeguimiento = () => {
    if (!siniestroSeleccionado) {
      setAlerta({
        message: "Por favor, selecciona un siniestro",
        type: "error",
      });
      return;
    }

    navigate(`/seguimiento-detalle/${siniestroSeleccionado}`);
  };

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-red-200 to-red-300 p-10">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-4xl font-bold text-red-700 flex items-center justify-center gap-2">
            📊 Gestión de Seguimiento
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Por favor, seleccione un siniestro de la lista para ver el
            seguimiento detallado.
          </p>

          {alerta && (
            <Alert
              type={alerta.type}
              message={alerta.message}
              onClose={() => setAlerta(null)}
            />
          )}

          {/* Selección de siniestro */}
          <div className="mb-4">
            <label className="block font-medium text-gray-800">
              Seleccionar Siniestro
            </label>
            <select
              className="border border-gray-300 p-3 w-full rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
              onChange={handleSiniestroSeleccionado}
            >
              <option value="">Seleccione un siniestro</option>
              {siniestros.map((siniestro) => (
                <option
                  key={siniestro.siniestroid}
                  value={siniestro.siniestroid}
                >
                  Número {siniestro.siniestroid} - {siniestro.descripcion}{" "}
                  (Fecha: {siniestro.fecha_siniestro})
                </option>
              ))}
            </select>
          </div>

          {/* Ver Seguimiento Button */}
          <div className="mb-4 flex items-center justify-center gap-4">
            <button
              onClick={handleVerSeguimiento}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Ver Seguimiento
            </button>

            <button
              type="button"
              className="bg-[#1f2937] hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center"
              onClick={() => navigate("/dashboard/general")}
            >
              <IoMdArrowBack className="mr-2 text-lg" /> Regresar al Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeguimientoSiniestros;
