import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";

// Endpoint del backend para reportes
const API_REPORTES_URL =
  import.meta.env.VITE_API_REPORTES_URL || "http://localhost:5001/api/GenerarReporte";

interface ReporteSummary {
  siniestroid: number;
  fecha_siniestro: string;
  estado: string;
}

interface ReporteDetail extends ReporteSummary {
  tipo_siniestro: string;
  descripcion: string;
  nombre_taller: string;
  montototal: number;
}

// Función para formatear la fecha a dd-mm-yyyy
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const GenerarReporte = () => {
  const [reportes, setReportes] = useState<ReporteSummary[]>([]);
  const [filteredReportes, setFilteredReportes] = useState<ReporteSummary[]>([]);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("siniestroid"); // Filtro predeterminado
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning" | "info"; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReporte, setSelectedReporte] = useState<ReporteDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 15;

  useEffect(() => {
    fetchReportes();
  }, []);

  useEffect(() => {
    filterReportes();
  }, [search, searchField, reportes]);

  const fetchReportes = async () => {
    try {
      const response = await fetch(API_REPORTES_URL);
      const data = await response.json();
      setReportes(data);
      setFilteredReportes(data);
    } catch (error) {
      setAlert({ type: "error", message: "Error al obtener reportes" });
    }
  };

  // Obtener el detalle del reporte
  const fetchReporteDetalle = async (id: number) => {
    try {
      const response = await fetch(`${API_REPORTES_URL}/${id}`);
      const data = await response.json();
      setSelectedReporte(data);
    } catch (error) {
      setAlert({ type: "error", message: "Error al obtener detalle del reporte" });
    }
  };

  // Función de filtrado actualizada
  const filterReportes = () => {
    const searchUpper = search.toUpperCase().trim();
    const filtered = reportes.filter((r) => {
      let value: string = "";
      if (searchField === "siniestroid") {
        value = r.siniestroid.toString();
        // Si se ingresa "SIN-" al inicio
        if (searchUpper.startsWith("SIN-")) {
          const numericPart = searchUpper.slice(4).trim();
          // Si no hay números después de "SIN-", no filtra nada
          if (!numericPart) return true;
          return value.startsWith(numericPart);
        }
      } else if (searchField === "fecha_siniestro") {
        // Transformamos la fecha a formato dd-mm-yyyy
        value = formatDate(r.fecha_siniestro);
      } else if (searchField === "estado") {
        value = r.estado;
      }
      return value.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredReportes(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredReportes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReportes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleVerReporte = async (id: number) => {
    await fetchReporteDetalle(id);
    setModalOpen(true);
  };

  const handleDescargarPdf = (id: number) => {
    window.open(`${API_REPORTES_URL}/${id}/pdf`, "_blank");
  };

  return (
    <>
      <Navbar />
      <div className="p-8 min-h-screen bg-gradient-to-br from-white via-gray-100 to-red-50 text-gray-900 pt-24">
        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}
        <div className="flex items-center justify-center mb-6 relative">
          {/* Botón "Regresar" en posición absoluta a la izquierda */}
          <button
            onClick={() => navigate("/dashboard/admin")}
            className="absolute left-0 flex items-center gap-2 bg-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            <ArrowLeft size={18} />
            Regresar
          </button>
          {/* Título centrado */}
          <h1 className="text-4xl font-extrabold text-gray-800 text-center">
            📋 GENERAR REPORTES
          </h1>
          <div className="absolute right-0"></div>
        </div>
        {/* Barra de búsqueda y selección de campo */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar reporte... (ej. SIN-1)"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 rounded-lg"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="siniestroid">Siniestro ID</option>
            <option value="fecha_siniestro">Fecha</option>
            <option value="estado">Estado</option>
          </select>
        </div>
        {/* Tabla de Reportes */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <table className="w-full border border-gray-200 text-gray-800">
            <thead className="bg-gradient-to-r from-red-500 to-red-400 text-white uppercase text-sm tracking-wide">
              <tr>
                <th className="p-3 text-center">ID SINIESTRO</th>
                <th className="p-3 text-center">FECHA</th>
                <th className="p-3 text-center">ESTADO</th>
                <th className="p-3 text-center">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((reporte) => (
                <tr key={reporte.siniestroid} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 text-center">{"SIN-" + reporte.siniestroid}</td>
                  <td className="p-3 text-center">{formatDate(reporte.fecha_siniestro)}</td>
                  <td className="p-3 text-center">{reporte.estado}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleVerReporte(reporte.siniestroid)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Ver Reporte
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {/* Modal para mostrar detalle del reporte */}
        {modalOpen && selectedReporte && (
          <Modal onClose={() => setModalOpen(false)}>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detalle del Reporte</h2>
              <div className="space-y-2 text-left">
                <p><strong>ID Siniestro:</strong> {"SIN-" + selectedReporte.siniestroid}</p>
                <p><strong>Fecha:</strong> {formatDate(selectedReporte.fecha_siniestro)}</p>
                <p><strong>Tipo de Siniestro:</strong> {selectedReporte.tipo_siniestro}</p>
                <p><strong>Descripción:</strong> {selectedReporte.descripcion}</p>
                <p><strong>Taller:</strong> {selectedReporte.nombre_taller}</p>
                <p><strong>Monto Total:</strong> {selectedReporte.montototal}</p>
                <p><strong>Estado:</strong> {selectedReporte.estado}</p>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => handleDescargarPdf(selectedReporte.siniestroid)}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition"
                >
                  Descargar PDF
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default GenerarReporte;
