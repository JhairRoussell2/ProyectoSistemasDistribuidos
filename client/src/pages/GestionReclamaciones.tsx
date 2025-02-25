import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerReclamaciones,
  eliminarReclamacion,
} from "../services/apiGestionReclamaciones";
import { IoMdArrowBack } from "react-icons/io";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";
import "react-toastify/dist/ReactToastify.css"; // Importamos estilos de Toastify
import { toast, ToastContainer } from "react-toastify";

const GestionarReclamaciones: React.FC = () => {
  const navigate = useNavigate();
  const [reclamaciones, setReclamaciones] = useState<any[]>([]);


  const [alerta, setAlerta] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>(""); // Para filtrar por código o ID de siniestro
  const [filterType, setFilterType] = useState<string>(""); // Para filtrar por tipo

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(10);

  // Cargar las reclamaciones
  useEffect(() => {
    const fetchData = async () => {
      try {

        const reclamacionesData = await obtenerReclamaciones();
        setReclamaciones(reclamacionesData);
      } catch (error) {
        setAlerta({
          message: "Error al cargar las reclamaciones",
          type: "error",
        });
      } finally {

      }
    };
    fetchData();
  }, []);

  // Filtrar y ordenar las reclamaciones
  const filteredReclamaciones = reclamaciones
    .filter((reclamacion) => {
      return (
        (reclamacion.reclamacionid.toString().includes(searchTerm) ||
          reclamacion.siniestroid.toString().includes(searchTerm)) &&
        (filterType === "" || reclamacion.tipo === filterType)
      );
    })
    .sort((a, b) => a.reclamacionid - b.reclamacionid); // Ordenar por ID de reclamación de menor a mayor

  // Calcular los registros que deben mostrarse en la página actual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredReclamaciones.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  // Cambiar la página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  const handleEliminarReclamacion = async (id: number) => {
    // Creamos un toast de confirmación con un ID
    const toastId = toast(
      <div>
        <span>¿Está seguro de que desea eliminar esta reclamación?</span>
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={async () => {
              try {
                // Cerramos el toast de confirmación con el toastId
                toast.dismiss(toastId);

                // Procedemos con la eliminación
                await eliminarReclamacion(id.toString());
                setReclamaciones((prevReclamaciones) =>
                  prevReclamaciones.filter(
                    (reclamacion) => reclamacion.reclamacionid !== id
                  )
                );

                // Mostramos un toast de éxito
                toast.success("Reclamación eliminada con éxito", {});
              } catch (error) {
                // Si ocurre un error, mostramos un toast de error
                toast.error("Error al eliminar la reclamación", {});
              }
            }}
            style={{
              backgroundColor: "#DC2626", // Rojo oscuro
              color: "white",
              border: "none",
              padding: "5px 20px",
              borderRadius: "5px",
              fontSize: "14px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss(toastId)} // Cierra el toast de confirmación
            style={{
              backgroundColor: "#4B5563", // Gris oscuro
              color: "white",
              border: "none",
              padding: "5px 20px",
              borderRadius: "5px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        autoClose: false, // Mantener el toast hasta que se cierre explícitamente
      }
    );
  };

  const handleVerDetalles = (id: number) => {
    navigate(`/detalles-reclamacion/${id}`);
  };

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-red-200 to-red-300 p-20">
        <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-5xl font-bold text-red-700 text-center">
            Gestionar Reclamaciones
          </h2>
          {alerta && (
            <Alert
              type={alerta.type}
              message={alerta.message}
              onClose={() => setAlerta(null)}
            />
          )}

          {/* Filtros */}
          <div className="mb-6 flex justify-between">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Buscar por Código o ID Siniestro"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Filtrar por Tipo</option>
                <option value="Daño Material">Daño Material</option>
                <option value="Robo Total">Robo Total</option>
                <option value="Lesiones Personales">Lesiones Personales</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <button
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center space-x-2 shadow-md mb-6 ml-auto"
              onClick={() => navigate("/dashboard/personal")}
            >
              <IoMdArrowBack /> <span>Volver al Dashboard</span>
            </button>
          </div>

          <table className="w-full mt-8 table-auto border-collapse">
            <thead>
              <tr>
                <th className="py-3 px-5 text-left">Código de Reclamación</th>
                <th className="py-3 px-5 text-left">Tipo</th>
                <th className="py-3 px-5 text-left">Estado</th>
                <th className="py-3 px-5 text-left">ID Siniestro</th>{" "}
                {/* Nueva columna */}
                <th className="py-3 px-5 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((reclamacion) => (
                <tr key={reclamacion.reclamacionid}>
                  <td className="py-2 px-5">{`REC-${reclamacion.reclamacionid}`}</td>
                  <td className="py-2 px-5">{reclamacion.tipo}</td>
                  <td className="py-2 px-5">{reclamacion.estado}</td>
                  <td className="py-2 px-5">{reclamacion.siniestroid}</td>{" "}
                  {/* Nueva columna */}
                  <td className="py-2 px-5">
                    <button
                      onClick={() =>
                        handleVerDetalles(reclamacion.reclamacionid)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mr-2"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() =>
                        handleEliminarReclamacion(reclamacion.reclamacionid)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-center mt-4 space-x-2">
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-500 text-white py-2 px-4 rounded-md"
              >
                Anterior
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage * postsPerPage >= filteredReclamaciones.length
                }
                className="bg-gray-500 text-white py-2 px-4 rounded-md"
              >
                Siguiente
              </button>
            </div>
            
          </div>

          {/* Información de paginación */}
          <div className="mt-4 text-center">
            <p>
              Mostrando {indexOfFirstPost + 1} a{" "}
              {Math.min(indexOfLastPost, filteredReclamaciones.length)} de{" "}
              {filteredReclamaciones.length} reclamaciones
            </p>
            <p>
              Página {currentPage} de{" "}
              {Math.ceil(filteredReclamaciones.length / postsPerPage)}
            </p>
          </div>






          
        </div>
      </div>
    </>
  );
};

export default GestionarReclamaciones;
