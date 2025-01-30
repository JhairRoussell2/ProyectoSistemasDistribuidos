import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import { Edit3, Save, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar"; // Importar el Navbar

const API_PROVEEDORES_URL = import.meta.env.VITE_API_PROVEEDORES_URL || "http://localhost:5000/api/proveedores";

const EditarProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [form, setForm] = useState({
    Nombre_Proveedor: "",
    Dirección: "",
    Teléfono_Proveedor: "",
    Correo_Electrónico: "",
    Tipo_Proveedor: "Distribuidor",
    Estado_Proveedor: "Activo",
    Valoración: "",
    Notas: "",
  });

  useEffect(() => {
    fetchProveedor();
  }, []);

  const fetchProveedor = async () => {
    try {
      const response = await fetch(`${API_PROVEEDORES_URL}/${id}`);
      const data = await response.json();
      setForm(data);
    } catch (error) {
      setAlert({ type: "error", message: "Error al obtener el proveedor" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await fetch(`${API_PROVEEDORES_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setAlert({ type: "success", message: "Proveedor actualizado con éxito" });

      setTimeout(() => navigate("/proveedores"), 3000);
    } catch (error) {
      setAlert({ type: "error", message: "Error al actualizar el proveedor" });
    }
  };

  return (
    <>
    <Navbar/>

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-100 via-red-200 to-red-300 p-6 text-gray-900 pt-24">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl border border-red-300">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-red-700 flex items-center gap-2">
            <Edit3 size={28} /> Editar Proveedor
          </h1>
          <button onClick={() => navigate("/proveedores")} className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
            <ArrowLeft size={20} /> Volver
          </button>
        </div>
        <p className="text-gray-600 mt-1">Modifica los datos del proveedor.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="text-sm font-semibold">Nombre del Proveedor</label>
            <input
              type="text"
              name="Nombre_Proveedor"
              placeholder="Ejemplo: Proveedor Global S.A."
              value={form.Nombre_Proveedor}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Dirección</label>
            <input
              type="text"
              name="Dirección"
              placeholder="Ejemplo: Av. Principal 123, Lima"
              value={form.Dirección}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Teléfono</label>
            <input
              type="text"
              name="Teléfono_Proveedor"
              placeholder="Ejemplo: +51 987 654 321"
              value={form.Teléfono_Proveedor}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Correo Electrónico</label>
            <input
              type="email"
              name="Correo_Electrónico"
              placeholder="Ejemplo: contacto@proveedor.com"
              value={form.Correo_Electrónico}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Tipo de Proveedor</label>
            <select
              name="Tipo_Proveedor"
              value={form.Tipo_Proveedor}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg mt-1"
            >
              <option value="Distribuidor">Distribuidor</option>
              <option value="Fabricante">Fabricante</option>
              <option value="Mayorista">Mayorista</option>
              <option value="Minorista">Minorista</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Estado del Proveedor</label>
            <select
              name="Estado_Proveedor"
              value={form.Estado_Proveedor}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg mt-1"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Valoración (0 - 10)</label>
            <input
              type="number"
              name="Valoración"
              placeholder="Ejemplo: 8.5"
              value={form.Valoración}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg mt-1"
              min="0"
              max="10"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-semibold">Notas</label>
            <textarea
              name="Notas"
              placeholder="Ejemplo: Entrega rápida y atención personalizada"
              value={form.Notas}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg mt-1"
              rows={3}
            />
          </div>

          <div className="col-span-2 flex justify-end">
            <button type="submit" className="bg-red-500 hover:bg-red-600 px-5 py-2 text-white rounded-lg flex items-center gap-2">
              <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default EditarProveedor;
