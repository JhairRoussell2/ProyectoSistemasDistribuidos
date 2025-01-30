import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import { Trash2, XCircle, CheckCircle } from "lucide-react";

const API_PROVEEDORES_URL = import.meta.env.VITE_API_PROVEEDORES_URL || "http://localhost:5000/api/proveedores";

const EliminarProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [proveedor, setProveedor] = useState<{ Nombre_Proveedor: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProveedor();
  }, []);

  const fetchProveedor = async () => {
    try {
      const response = await fetch(`${API_PROVEEDORES_URL}/${id}`);
      const data = await response.json();
      setProveedor(data);
    } catch (error) {
      setAlert({ type: "error", message: "Error al obtener el proveedor" });
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_PROVEEDORES_URL}/${id}`, { method: "DELETE" });

      setAlert({ type: "success", message: "Proveedor eliminado correctamente" });
      setModalOpen(false);

      setTimeout(() => navigate("/proveedores"), 3000);
    } catch (error) {
      setAlert({ type: "error", message: "Error al eliminar el proveedor" });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-100 via-red-200 to-red-300 text-gray-900 p-6">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg border border-red-300 text-center">
        <h1 className="text-4xl font-bold text-red-700 flex items-center justify-center gap-2">
          <Trash2 size={36} /> Eliminar Proveedor
        </h1>
        <p className="text-gray-600 mt-2">¿Estás seguro de eliminar este proveedor?</p>

        {proveedor ? (
          <p className="mt-4 text-lg font-semibold text-gray-900">"{proveedor.Nombre_Proveedor}"</p>
        ) : (
          <p className="text-gray-500">Cargando proveedor...</p>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate("/proveedores")}
            className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
          >
            <XCircle size={18} /> Cancelar
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
          >
            <Trash2 size={18} /> Eliminar
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h2 className="text-lg font-bold text-gray-900">¿Eliminar Proveedor?</h2>
          <p className="text-gray-500 text-sm">Esta acción no se puede deshacer.</p>

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white flex items-center gap-2"
            >
              <CheckCircle size={18} /> Confirmar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EliminarProveedor;
