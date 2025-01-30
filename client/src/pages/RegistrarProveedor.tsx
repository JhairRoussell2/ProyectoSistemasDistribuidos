import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const RegistrarProveedor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    tipo: "",
    estado: "",
    valoracion: "",
    notas: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("📤 Enviando datos al backend:", JSON.stringify(form, null, 2));
  
    try {
      const response = await axios.post("http://localhost:4003/api/proveedores", form, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("✅ Respuesta del servidor:", response.data);
      alert("Proveedor registrado con éxito");
      navigate("/dashboard/proveedores");
    } catch (error: any) {
      console.error("❌ Error al registrar el proveedor:", error.response?.data || error);
      alert(error.response?.data?.message || "Ocurrió un error al registrar el proveedor");
    }
  };
  

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-600 min-h-screen text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white text-black shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Registrar Proveedor</h1>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del Proveedor"
            value={form.nombre}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo Electrónico"
            value={form.correo}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            name="tipo"
            placeholder="Tipo de Proveedor"
            value={form.tipo}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            name="estado"
            placeholder="Estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="valoracion"
            placeholder="Valoración"
            value={form.valoracion}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <textarea
            name="notas"
            placeholder="Notas"
            value={form.notas}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-300"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 shadow-md transition duration-300"
          >
            Registrar Proveedor
          </button>
        </form>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/dashboard/proveedores")}
          className="bg-gray-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-800 focus:ring focus:ring-gray-300 shadow-md transition duration-300"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default RegistrarProveedor;
