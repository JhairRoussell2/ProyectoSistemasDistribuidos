import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";
import axios from "axios";

const API_TALLERES_URL = import.meta.env.VITE_API_TALLERES_URL || "http://localhost:5001/api/talleres";
const API_PROVEEDORES_URL = import.meta.env.VITE_API_PROVEEDORES_URL || "http://localhost:5001/api/proveedores";

const RegistrarTaller = () => {
  const navigate = useNavigate();
  interface AlertType {
    type: "success" | "error";
    message: string;
  }

  const [alert, setAlert] = useState<AlertType | null>(null);

  interface Proveedor {
    id_proveedor: number;
    nombre_proveedor: string;
  }

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    capacidad: "",
    telefono: "",
    proveedor_id: "", // Ahora usa proveedor_id en lugar de proveedor
  });

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(API_PROVEEDORES_URL);
        setProveedores(response.data);
      } catch (error) {
        console.error("Error al obtener proveedores", error);
      }
    };
    fetchProveedores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const dataToSend = { ...form, proveedor_id: Number(form.proveedor_id) };
      await axios.post(API_TALLERES_URL, dataToSend);
      setAlert({ type: "success", message: "Taller creado correctamente" });
      setTimeout(() => navigate("/talleres"), 3000);
    } catch (error) {
      setAlert({ type: "error", message: "Error al crear el taller" });
      console.error("Error al crear el taller:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-100 via-red-200 to-red-300 text-gray-900 pt-24">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl border border-blue-300">
          <h1 className="text-4xl font-bold text-red-700 text-center mb-4">🛠️ Registrar Taller</h1>
          <p className="text-gray-600 text-center mb-6">Completa los datos para añadir un nuevo taller.</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Nombre del Taller</label>
              <input type="text" name="nombre" placeholder="Taller Mecánico ABC" value={form.nombre} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-red-50" required />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Dirección</label>
              <input type="text" name="direccion" placeholder="Av. Principal 123, Ciudad" value={form.direccion} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-red-50" required />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Capacidad</label>
              <input type="number" name="capacidad" placeholder="50" min="1" value={form.capacidad} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-red-50" required />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Teléfono</label>
              <input type="tel" name="telefono" placeholder="+51 987 654 321" value={form.telefono} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-red-50" required />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Proveedor</label>
              <select name="proveedor_id" value={form.proveedor_id} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-red-50" required>
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>{proveedor.nombre_proveedor}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="col-span-2 bg-red-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2">
              <CheckCircle size={18} /> Registrar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrarTaller;
