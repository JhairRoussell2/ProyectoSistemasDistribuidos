import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil, Plus } from "lucide-react";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";

const API_TALLERES_URL = import.meta.env.VITE_API_TALLERES_URL || "http://localhost:5001/api/talleres";

const Talleres = () => {
  const [talleres, setTalleres] = useState<any[]>([]);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTalleres();
  }, []);

  const fetchTalleres = async () => {
    try {
      const response = await fetch(API_TALLERES_URL);
      const data = await response.json();
      setTalleres(data);
    } catch (error) {
      setAlert({ type: "error", message: "Error al obtener talleres" });
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await fetch(`${API_TALLERES_URL}/${selectedId}`, { method: "DELETE" });
      setAlert({ type: "success", message: "Taller eliminado correctamente"});
      setModalOpen(false);
      fetchTalleres();
    } catch (error) {
      setAlert({ type: "error", message: "Error al eliminar el taller" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 min-h-screen bg-gradient-to-br from-white via-gray-100 to-blue-50 text-gray-900 pt-24">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">🏭 Talleres</h1>
          <button 
            onClick={() => navigate("/registrar-taller")} 
            className="flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            <Plus size={18} />
            Agregar Taller
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          <table className="w-full border border-gray-200 text-gray-800">
            <thead className="bg-gradient-to-r from-red-500 to-red-400 text-white uppercase text-sm tracking-wide">
              <tr>
                <th className="p-3 text-center">Nombre</th>
                <th className="p-3 text-center">Ubicación</th>
                <th className="p-3 text-center">Teléfono</th>
                <th className="p-3 text-center">Capacidad</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-center">Proveedor</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {talleres.map((taller: any) => (
                <tr key={taller.id_taller} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 text-center">{taller.nombre}</td>
                  <td className="p-3 text-center">{taller.direccion}</td>
                  <td className="p-3 text-center">{taller.telefono}</td>
                  <td className="p-3 text-center">{taller.capacidad}</td>
                  <td className="p-3 text-center">{taller.estado}</td>
                  <td className="p-3 text-center">{taller.proveedor_nombre}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button 
                      onClick={() => navigate(`/editar-taller/${taller.tallerid}`)} 
                      className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedId(taller.tallerid);
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

        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">¿Eliminar Taller?</h2>
              <p className="text-gray-600">Esta acción no se puede deshacer.</p>
              <div className="flex justify-center gap-4 mt-4">
                <button 
                  onClick={() => setModalOpen(false)} 
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

export default Talleres;