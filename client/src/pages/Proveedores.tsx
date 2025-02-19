import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil, Plus, Eye, ArrowLeft } from "lucide-react";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";

const API_PROVEEDORES_URL = import.meta.env.VITE_API_PROVEEDORES_URL || "http://localhost:5001/api/proveedores";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [filteredProveedores, setFilteredProveedores] = useState<any[]>([]);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[] | null>(null);
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [modalSize, setModalSize] = useState("large");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual para la paginación
  const proveedoresPorPagina = 15; // Número de proveedores por página
  const navigate = useNavigate();

  useEffect(() => {
    fetchProveedores();
  }, []);

  useEffect(() => {
    filterProveedores();
  }, [searchTerm, proveedores]); // Filtra cuando cambia el término de búsqueda o proveedores

  const fetchProveedores = async () => {
    try {
      const response = await fetch(API_PROVEEDORES_URL);
      const data = await response.json();
      setProveedores(data);
      setFilteredProveedores(data); // Inicializa los proveedores filtrados
    } catch (error) {
      setAlert({ type: "error", message: "Error al obtener proveedores" });
    }
  };

  const filterProveedores = () => {
    const filtered = proveedores.filter(prov =>
      prov.nombre_proveedor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProveedores(filtered);
    setCurrentPage(1); // Restablece a la primera página cuando cambia el término de búsqueda
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await fetch(`${API_PROVEEDORES_URL}/${selectedId}`, { method: "DELETE" });
      setAlert({ type: "success", message: "Proveedor eliminado correctamente" });
      setModalOpen(false);
      fetchProveedores();
    } catch (error) {
      setAlert({ type: "error", message: "Error al eliminar el proveedor" });
    }
  };

  const handleViewDocuments = (documents: string[]) => {
    setSelectedDocuments(documents);
    setModalOpen(true); // Abre el modal con los documentos
  };

  const handleDocumentClick = (doc: string) => {
    setCurrentDocument(doc);
    setIsImage(doc.endsWith(".jpg") || doc.endsWith(".jpeg") || doc.endsWith(".png")); // Verificar si es imagen
    setModalSize("large"); // Establecer el tamaño del modal a grande
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDocuments(null);
    setCurrentDocument(null);
    setIsImage(false);
    setModalSize("large");
  };

  const handleViewLarger = (doc: string) => {
    window.open(doc, "_blank");
  };

  // Paginación
  const totalPages = Math.ceil(filteredProveedores.length / proveedoresPorPagina);
  const indexOfLastProvider = currentPage * proveedoresPorPagina;
  const indexOfFirstProvider = indexOfLastProvider - proveedoresPorPagina;
  const currentProviders = filteredProveedores.slice(indexOfFirstProvider, indexOfLastProvider);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Navbar />
      <div className="p-8 min-h-screen bg-gradient-to-br from-white via-gray-100 to-red-50 text-gray-900 pt-24">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {/* Botón Regresar */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard/admin")} // Cambia la ruta a tu ruta de administración
            className="flex items-center gap-2 bg-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            <ArrowLeft size={18} />
            Regresar al Dashboard
          </button>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-md"
          />
        </div>

        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">📋 Proveedores</h1>
          <button
            onClick={() => navigate("/registrar-proveedor")}
            className="flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
          >
            <Plus size={18} />
            Agregar Proveedor
          </button>
        </div>

        {/* Tabla de Proveedores */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <table className="w-full border border-gray-200 text-gray-800">
            <thead className="bg-gradient-to-r from-red-500 to-red-400 text-white uppercase text-sm tracking-wide">
              <tr>
                <th className="p-3 text-center">Nombre</th>
                <th className="p-3 text-center">Teléfono</th>
                <th className="p-3 text-center">Correo</th>
                <th className="p-3 text-center">Calificación</th>
                <th className="p-3 text-center">Documentos</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProviders.map((prov: any) => (
                <tr key={prov.id_proveedor} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 text-center">{prov.nombre_proveedor}</td>
                  <td className="p-3 text-center">{prov.telefono_proveedor}</td>
                  <td className="p-3 text-center">{prov.correo_electronico}</td>
                  <td className="p-3 text-center">{prov.valoracion}</td>

                  <td className="p-3 text-center">
                    {prov.documentos && prov.documentos.length > 0 ? (
                      <button
                        onClick={() => handleViewDocuments(prov.documentos)}
                        className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                      >
                        <Eye size={16} />
                        Ver Documentos ({prov.documentos.length})
                      </button>
                    ) : (
                      <span>No hay documentos</span>
                    )}
                  </td>

                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => navigate(`/editar-proveedor/${prov.id_proveedor}`)}
                      className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(prov.id_proveedor);
                        setModalOpen(true);
                      }}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} />
                      Eliminar
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
              className={`px-4 py-2 rounded-lg border ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Modales */}
        {modalOpen && selectedDocuments && (
          <Modal onClose={closeModal}>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">Documentos del Proveedor</h2>
              {selectedDocuments.length === 1 ? (
                <div className="mt-4">
                  <button
                    onClick={() => handleDocumentClick(selectedDocuments[0])}
                    className="text-blue-600 underline"
                  >
                    Ver Documento
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <ul className="list-disc pl-5">
                    {selectedDocuments.map((doc, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleDocumentClick(doc)}
                          className="text-blue-600 underline"
                        >
                          Ver Documento {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {currentDocument && (
                <div className="mt-4 flex flex-col items-center">
                  {isImage ? (
                    <div className="relative">
                      <img src={currentDocument} alt="Documento" width="100%" />
                      <div className="mt-4">
                        <button
                          onClick={() => handleViewLarger(currentDocument)}
                          className="bg-gray-600 text-white px-3 py-2 rounded-lg shadow-md"
                        >
                          Ver Más Grande
                        </button>
                      </div>
                    </div>
                  ) : currentDocument.endsWith(".pdf") ? (
                    <iframe src={currentDocument} width="100%" height="500px" title="Documento" />
                  ) : null}
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Modal de Confirmación de Eliminar */}
        {modalOpen && !selectedDocuments && (
          <Modal onClose={closeModal}>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">¿Eliminar Proveedor?</h2>
              <p className="text-gray-600">Esta acción no se puede deshacer.</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-600 px-5 py-2 rounded-lg text-white transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Proveedores;
