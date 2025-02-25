import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, CheckCircle } from "lucide-react";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";
import axios from "axios";

const API_PRESUPUESTO_URL = "https://segurosflexpresupuestopagos.onrender.com/api/presupuesto-pagos"; // 🔗 Cambiar por la URL de la API http://localhost:5002

interface AlertType {
  type: "success" | "error";
  message: string;
}

interface Poliza {
  tipopoliza: string;
  fechainicio: string;
  fechafin: string;
  estado: string;
}

interface Presupuesto {
  siniestroid: number;
  montototal: number;
  detalle_presupuesto: string;
  costo_reparacion: number;
  costo_piezas_mano_obra: number;
}

const GestionarPresupuesto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [documentos, setDocumentos] = useState<string[]>([]);
  const [mostrarDocumentos, setMostrarDocumentos] = useState(false);
  const [poliza, setPoliza] = useState<Poliza | null>(null);
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [polizaRes, presupuestoRes] = await Promise.all([
          axios.get(`${API_PRESUPUESTO_URL}/poliza/${id}`),
          axios.get(`${API_PRESUPUESTO_URL}/${id}`),
        ]);

        setPoliza(polizaRes.data);
        setPresupuesto(presupuestoRes.data);
      } catch (error) {
        setAlert({ type: "error", message: "Error al cargar datos" });
      }
    };

    fetchData();
  }, [id]);

  const handleValidarPresupuesto = async () => {
    if (!presupuesto) return;

    const montoTotal =
      Number(presupuesto.costo_reparacion) + Number(presupuesto.costo_piezas_mano_obra);
    const fechaCreacion = new Date().toISOString().split(".")[0];

    const data = {
      montototal: montoTotal,
      costo_reparacion: Number(presupuesto.costo_reparacion),
      costo_piezas_mano_obra: Number(presupuesto.costo_piezas_mano_obra),
      detalle_presupuesto: presupuesto.detalle_presupuesto,
      estado: "Validado",
      fechacreacion: fechaCreacion,
    };

    try {
      axios.put(`${API_PRESUPUESTO_URL}/${id}`, data); // await apiClient.put(`/${id}`,data);
      setAlert({ type: "success", message: "Presupuesto validado correctamente" });
      setTimeout(() => {
        navigate("/gestionarpresupuestos");
      }, 2000);
    } catch (error) {
      setAlert({ type: "error", message: "Error al validar presupuesto" });
    }
  };

  const fetchDocumentos = async () => {
    try {
      const response = await axios.get(`${API_PRESUPUESTO_URL}/documentos/${id}`); //await apiClient.get(`/documentos/${id}`);
      const documentosArray = JSON.parse(response.data.obtener_documentos);
      setDocumentos(documentosArray);
      setMostrarDocumentos(true);
    } catch (error) {
      setAlert({ type: "error", message: "No se pudieron cargar los documentos" });
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toISOString().split("T")[0];

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-red-100 via-red-200 to-red-300 text-gray-900 pt-24">
        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            {presupuesto && (
              <div className="bg-white shadow-lg rounded-xl p-6 border border-red-300">
                <h2 className="text-xl font-bold text-red-700 mb-4 text-center">
                  Detalles del Presupuesto
                </h2>
                <p className="block mt-2 text-gray-700 font-semibold">
                  Código de Siniestro: {`SIN-${presupuesto.siniestroid}`}
                </p>
                <label className="block mt-2 text-gray-700 font-semibold">Costo de Reparación:</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-red-200"
                  value={presupuesto.costo_reparacion}
                  onChange={(e) =>
                    setPresupuesto((prev) =>
                      prev ? { ...prev, costo_reparacion: Number(e.target.value) } : null
                    )
                  }
                />

                <label className="block mt-2 text-gray-700 font-semibold">
                  Costo Piezas y Mano de Obra:
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-red-200"
                  value={presupuesto.costo_piezas_mano_obra}
                  onChange={(e) =>
                    setPresupuesto((prev) =>
                      prev ? { ...prev, costo_piezas_mano_obra: Number(e.target.value) } : null
                    )
                  }
                />

                <strong className="block mt-2 text-gray-700 font-semibold">
                  Monto Total: S/
                  {Number(presupuesto.costo_reparacion) + Number(presupuesto.costo_piezas_mano_obra)}
                </strong>

                <label className="block mt-2 text-gray-700 font-semibold">
                  Detalle del Presupuesto:
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-red-200"
                  value={presupuesto.detalle_presupuesto}
                  onChange={(e) =>
                    setPresupuesto((prev) =>
                      prev ? { ...prev, detalle_presupuesto: e.target.value } : null
                    )
                  }
                />
              </div>
            )}

            {poliza && (
              <div className="bg-white shadow-lg rounded-xl p-6 border border-red-300">
                <h2 className="text-xl font-bold text-red-700 mb-4 text-center">
                  Detalles de la Póliza
                </h2>
                <p>
                  <strong>Tipo:</strong> {poliza.tipopoliza}
                </p>
                <p>
                  <strong>Fecha Inicio:</strong> {formatDate(poliza.fechainicio)}
                </p>
                <p>
                  <strong>Fecha Fin:</strong> {formatDate(poliza.fechafin)}
                </p>
                <p>
                  <strong>Estado:</strong> {poliza.estado}
                </p>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4 items-center">
            <button
              className="btn-primary flex items-center gap-2 px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              onClick={handleValidarPresupuesto}
            >
              <CheckCircle size={18} /> Validar Presupuesto
            </button>

            <button
              className="btn-primary flex items-center gap-2 px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
              onClick={fetchDocumentos}
            >
              <FileText size={18} /> Ver Documentos
            </button>

            {mostrarDocumentos && (
              <div className="bg-white shadow-lg rounded-xl p-6 border border-red-300">
                <p className="text-xl font-bold text-red-700 mb-4 text-center">Documentos Adjuntos</p>
                {documentos.map((doc, index) => (
                  <button key={index} onClick={() => window.open(doc, "_blank")} className="w-full text-center text-blue-500 hover:underline">
                    Documento {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GestionarPresupuesto;
