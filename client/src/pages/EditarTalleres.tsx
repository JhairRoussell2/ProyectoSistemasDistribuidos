import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";
import axios from "axios";

const API_TALLERES_URL = import.meta.env.VITE_API_TALLERES_URL || "http://localhost:5001/api/talleres";
const API_PROVEEDORES_URL = import.meta.env.VITE_API_PROVEEDORES_URL || "http://localhost:5001/api/proveedores";

const EditarTaller = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    estado: "Disponible",
    telefono: "",
    proveedor_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener proveedores primero
        const proveedoresResponse = await axios.get(API_PROVEEDORES_URL);
        setProveedores(proveedoresResponse.data);

        // Obtener datos del taller
        const tallerResponse = await axios.get(`${API_TALLERES_URL}/${id}`);
        const data = tallerResponse.data;

        setForm({
          nombre: data.nombre || "",
          direccion: data.direccion || "",
          capacidad: data.capacidad || "",
          estado: data.estado || "Disponible",
          telefono: data.telefono || "",
          // Convertir a string para que se muestre en el select
          proveedor_id: data.proveedor_id ? String(data.proveedor_id) : "",
        });
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setAlert({ type: "error", message: "Error al cargar los datos del taller" });
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Convertir el valor del proveedor a número antes de enviar
    const dataToSend = {
      ...form,
      proveedor_id: form.proveedor_id === "" ? null : Number(form.proveedor_id),
    };

    console.log("Datos enviados:", dataToSend); // Verifica en la consola

    try {
      await axios.put(`${API_TALLERES_URL}/${id}`, dataToSend);
      setAlert({ type: "success", message: "Taller actualizado correctamente" });
      setTimeout(() => navigate("/talleres"), 3000);
    } catch (error) {
      console.error("Error al actualizar el taller:", error);
      setAlert({ type: "error", message: "Error al actualizar el taller" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-100 via-red-200 to-red-300 text-gray-900 pt-24">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl border border-blue-300">
          <h1 className="text-4xl font-bold text-red-700 text-center mb-4">🛠️ Editar Taller</h1>
          <p className="text-gray-600 text-center mb-6">Modifica los datos del taller.</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Capacidad</label>
              <input
                type="number"
                name="capacidad"
                value={form.capacidad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="Disponible">Disponible</option>
                <option value="No Disponible">No Disponible</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Proveedor</label>
              <select
                name="proveedor_id"
                value={form.proveedor_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50"
                required
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                    {proveedor.nombre_proveedor}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="col-span-2 bg-red-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
            >
              <CheckCircle size={18} className="mr-2" />
              Actualizar Taller
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditarTaller;
