import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText, CheckCircle, AlignCenter } from "lucide-react";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";

const API_PRESUPUESTO_URL = "http://localhost:5002/api/presupuesto-pagos";

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
  // Estado para controlar la visibilidad de cada imagen de documento
  const [docVisible, setDocVisible] = useState<{ [key: number]: boolean }>({});
  const [poliza, setPoliza] = useState<Poliza | null>(null);
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [polizaRes, presupuestoRes] = await Promise.all([
          axios.get(`${API_PRESUPUESTO_URL}/poliza/${id}`),
          axios.get(`${API_PRESUPUESTO_URL}/${id}`)
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

    // Calcula el monto total con base en los datos ingresados por el usuario
    const montoTotal =
      Number(presupuesto.costo_reparacion) + Number(presupuesto.costo_piezas_mano_obra);
    // La fecha de creación es el momento actual sin milisegundos ni Z
    const fechaCreacion = new Date().toISOString().split(".")[0];

    const data = {
      montototal: montoTotal,
      costo_reparacion: Number(presupuesto.costo_reparacion),
      costo_piezas_mano_obra: Number(presupuesto.costo_piezas_mano_obra),
      detalle_presupuesto: presupuesto.detalle_presupuesto,
      estado: "Validado", // Siempre se envía "Validado"
      fechacreacion: fechaCreacion, // La fecha de creación es ahora
    };

    try {
      await axios.put(`${API_PRESUPUESTO_URL}/${id}`, data);
      setAlert({ type: "success", message: "Presupuesto validado correctamente" });
      // Redirige a la ruta deseada tras la validación exitosa
      setTimeout(() => {
        navigate("/gestionarpresupuestos");
      }, 2000);
    } catch (error) {
      setAlert({ type: "error", message: "Error al validar presupuesto" });
    }
  };

  const fetchDocumentos = async () => {
    try {
      const response = await axios.get(`${API_PRESUPUESTO_URL}/documentos/${id}`);
      const documentosArray = JSON.parse(response.data.obtener_documentos);
      setDocumentos(documentosArray);
      setMostrarDocumentos(true);
      // Inicializa la visibilidad de cada documento a false
      const initialVisibility: { [key: number]: boolean } = {};
      documentosArray.forEach((_: string, index: number) => {
        initialVisibility[index] = false;
      });
      setDocVisible(initialVisibility);
    } catch (error) {
      setAlert({ type: "error", message: "No se pudieron cargar los documentos" });
    }
  };

  // Función para formatear fechas a "YYYY-MM-DD"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Alterna la visibilidad de la imagen del documento al hacer clic
  const toggleDocument = (index: number) => {
    setDocVisible((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-red-100 via-red-200 to-red-300 text-gray-900 pt-24">
        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
          {/* Sección izquierda: Detalles del Presupuesto y de la Póliza */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            {/* Card de Detalles del Presupuesto */}
            {presupuesto && (
              <div className="bg-white shadow-lg rounded-xl p-6 border border-red-300">
                <h2 className="text-xl font-bold text-red-700 mb-4">
                  Detalles del Presupuesto
                </h2>
                <p className="block mt-2 text-gray-700 font-semibold">
                  Código de Siniestro: {`SIN-${presupuesto.siniestroid}`}
                </p>
                <strong className="block mt-2 text-gray-700 font-semibold">
                  Costo de Reparación:
                </strong>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <span className="bg-gray-200 px-3 py-2 text-gray-700">S/.</span>
                  <input
                    type="number"
                    className="w-full p-2 border-l border-gray-300 focus:ring focus:ring-red-200"
                    value={presupuesto.costo_reparacion}
                    onChange={(e) =>
                      setPresupuesto((prev) =>
                        prev
                          ? {
                            ...prev,
                            costo_reparacion: Number(e.target.value),
                          }
                          : null
                      )
                    }
                  />
                </div>

                <label className="block mt-2 text-gray-700 font-semibold">
                  Costo Piezas y Mano de Obra:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <span className="bg-gray-200 px-3 py-2 text-gray-700">S/.</span>
                  <input
                    type="number"
                    className="w-full p-2 border-l border-gray-300 focus:ring focus:ring-red-200"
                    value={presupuesto.costo_piezas_mano_obra}
                    onChange={(e) =>
                      setPresupuesto((prev) =>
                        prev
                          ? {
                            ...prev,
                            costo_piezas_mano_obra: Number(e.target.value),
                          }
                          : null
                      )
                    }
                  />
                </div>
                <strong className="inline mt-2 text-gray-700 font-semibold">
                  Monto Total: 
                </strong>
                <strong> S/{Number(presupuesto.costo_reparacion) +
                  Number(presupuesto.costo_piezas_mano_obra)}</strong>
                

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

            {/* Card de Detalles de la Póliza */}
            {poliza && (
              <div className="bg-white shadow-lg rounded-xl p-6 border border-red-300">
                <h2 className="text-xl font-bold text-red-700 mb-4">
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

          {/* Sección derecha: Botones y lista de documentos */}
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

            {/* Lista de documentos con los botones centrados */}
            {mostrarDocumentos && (
              <div className="bg-white shadow-lg rounded-xl p-6 border border-red-300">
                <p className="text-xl font-bold text-red-700 mb-4" style={{textAlign: "center"}}>Documentos Adjuntos</p>
                {documentos.map((doc, index) => (
                  <div key={index} className="mb-2">
                    <button
                      onClick={() => window.open(doc, "_blank")}  // Abre el documento en una nueva pestaña
                      className="w-full text-center text-blue-500 hover:underline"
                    >
                      Documento {index + 1}
                    </button>
                  </div>
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
