import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, MapPin, Mail, Phone, User, Star } from "lucide-react";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar"; // Importar el Navbar
const API_PROVEEDORES_URL = import.meta.env.VITE_API_PROVEEDORES_URL || "http://localhost:5000/api/proveedores";

const RegistrarProveedor = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(API_PROVEEDORES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Error al registrar proveedor");

      setAlert({ type: "success", message: "Proveedor registrado con éxito" });

      setTimeout(() => navigate("/proveedores"), 3000);
    } catch (error) {
      setAlert({ type: "error", message: "Error al registrar el proveedor" });
    }
  };

  return (
    <>
      <Navbar />
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-100 via-red-200 to-red-300 text-gray-900 pt-24">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl border border-red-300">
        <h1 className="text-4xl font-bold text-red-700 text-center mb-4">📦 Registrar Proveedor</h1>
        <p className="text-gray-600 text-center mb-6">Completa los datos para añadir un nuevo proveedor.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* NOMBRE */}
          <div>
            <label className="block text-gray-700 font-semibold">Nombre del Proveedor</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="Nombre_Proveedor"
                placeholder="Proveedor Global S.A."
                value={form.Nombre_Proveedor}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 bg-red-50"
                required
              />
            </div>
          </div>

          {/* DIRECCIÓN */}
          <div>
            <label className="block text-gray-700 font-semibold">Dirección</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="Dirección"
                placeholder="Av. Principal 123, Lima"
                value={form.Dirección}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 bg-red-50"
              />
            </div>
          </div>

          {/* TELÉFONO */}
          <div>
            <label className="block text-gray-700 font-semibold">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                name="Teléfono_Proveedor"
                placeholder="+51 987 654 321"
                value={form.Teléfono_Proveedor}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 bg-red-50"
              />
            </div>
          </div>

          {/* CORREO ELECTRÓNICO */}
          <div>
            <label className="block text-gray-700 font-semibold">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="Correo_Electrónico"
                placeholder="contacto@proveedor.com"
                value={form.Correo_Electrónico}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 bg-red-50"
                required
              />
            </div>
          </div>

          {/* TIPO DE PROVEEDOR */}
          <div>
            <label className="block text-gray-700 font-semibold">Tipo de Proveedor</label>
            <select
              name="Tipo_Proveedor"
              value={form.Tipo_Proveedor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50"
            >
              <option value="Distribuidor">Distribuidor</option>
              <option value="Fabricante">Fabricante</option>
              <option value="Mayorista">Mayorista</option>
              <option value="Minorista">Minorista</option>
            </select>
          </div>

          {/* ESTADO DEL PROVEEDOR */}
          <div>
            <label className="block text-gray-700 font-semibold">Estado del Proveedor</label>
            <select
              name="Estado_Proveedor"
              value={form.Estado_Proveedor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          {/* VALORACIÓN */}
          <div>
            <label className="block text-gray-700 font-semibold">Valoración (0 - 10)</label>
            <div className="relative">
              <Star className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                name="Valoración"
                placeholder="10"
                min="0"
                max="10"
                value={form.Valoración}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 bg-red-50"
              />
            </div>
          </div>

          {/* NOTAS */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-semibold">Notas</label>
            <textarea
              name="Notas"
              placeholder="Entrega rápida y atención personalizada"
              value={form.Notas}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-400 bg-red-50"
              rows={3}
            />
          </div>

          {/* BOTÓN REGISTRAR */}
          <button
            type="submit"
            className="col-span-2 bg-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            Registrar
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default RegistrarProveedor;
