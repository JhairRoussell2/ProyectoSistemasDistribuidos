import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import GenerateReport from "../components/GenerateReport";

interface Beneficiario {
  beneficiarioid: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  password: string;
}

const MantenerBeneficiarios = () => {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [filteredBeneficiarios, setFilteredBeneficiarios] = useState<Beneficiario[]>([]);
  const [searchdni, setSearchdni] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null);
  const [password, setPassword] = useState(""); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeneficiarios = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/beneficiarios");
        const data = response.data;
        console.log(data);
        setBeneficiarios(data);
        setFilteredBeneficiarios(data);
      } catch (error) {
        console.error("Error al obtener los beneficiarios:", error);
        alert("No se pudo cargar la lista de beneficiarios. Inténtalo de nuevo más tarde.");
      }
    };
    fetchBeneficiarios();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchdni(value);
    const filtered = beneficiarios.filter((b) => b.dni.includes(value));
    setFilteredBeneficiarios(filtered);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/beneficiarios/${id}`);
      alert("Beneficiario eliminado correctamente");
      const updatedList = beneficiarios.filter((b) => b.beneficiarioid !== id);
      setBeneficiarios(updatedList);
      setFilteredBeneficiarios(updatedList);
    } catch (error) {
      console.error("Error al eliminar el beneficiario:", error);
      alert("No se pudo eliminar el beneficiario");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditing && selectedBeneficiario) {
      setSelectedBeneficiario({ ...selectedBeneficiario, [name]: value });
    }
  };

  const handleUpdate = async () => {
    if (!selectedBeneficiario) return;
    if (!password) {
      alert("Por favor, ingrese su contraseña para confirmar la actualización.");
      return;
    }
  
    const datosActualizados = {
      nombre: selectedBeneficiario.nombre,
      apellido: selectedBeneficiario.apellido,
      dni: selectedBeneficiario.dni,
      email: selectedBeneficiario.email,
      telefono: selectedBeneficiario.telefono,
      password, // Se usa solo para verificar identidad
    };
  
    console.log("Datos a actualizar:", datosActualizados); // Verifica en la consola que solo se envíen estos datos
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/beneficiarios/${selectedBeneficiario.beneficiarioid}`,
        datosActualizados,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.status === 200) {

        alert("Beneficiario actualizado correctamente");
        const updatedBeneficiarios = beneficiarios.map((b) =>
          b.beneficiarioid === selectedBeneficiario.beneficiarioid
            ? { ...selectedBeneficiario }
            : b
        );    

        setBeneficiarios(updatedBeneficiarios);
        setFilteredBeneficiarios(updatedBeneficiarios);

        setIsModalOpen(false);
        setPassword(""); // Limpiar el campo de contraseña
      }
    } catch (error) {
      console.error("Error al actualizar beneficiario:", error);
      alert("No se pudo actualizar el beneficiario.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-16 p-8 bg-white border border-gray-200 rounded-lg shadow-lg text-black">
        <button
          onClick={() => navigate("/dashboard/personal")}
          className="flex items-center text-gray-400 hover:text-black mb-6"
        >
          <ArrowLeftIcon className="w-6 h-6 mr-2" />
          <span>Volver</span>
        </button>

        <h1 className="text-4xl font-bold text-black text-center mb-8">
          Mantener Beneficiarios
        </h1>

        <div className="mb-6 flex justify-between items-center">
          <GenerateReport /> 
        </div>

        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar por dni"
            value={searchdni}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-black placeholder-gray-400 focus:ring focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-red-500 text-white">
              <th className="border border-gray-300 px-6 py-3 text-left">Nombre</th>
              <th className="border border-gray-300 px-6 py-3 text-left">Apellido</th>
              <th className="border border-gray-300 px-6 py-3 text-left">DNI</th>
              <th className="border border-gray-300 px-6 py-3 text-left">Teléfono</th>
              <th className="border border-gray-300 px-6 py-3 text-left">Email</th>
              <th className="border border-gray-300 px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredBeneficiarios) && filteredBeneficiarios.length > 0 ? (
              filteredBeneficiarios.map((b) => (
                <tr key={b.beneficiarioid} className="text-center bg-gray-100 hover:bg-gray-200">
                  <td className="border border-gray-300 px-6 py-3">{b.nombre}</td>
                  <td className="border border-gray-300 px-6 py-3">{b.apellido}</td>
                  <td className="border border-gray-300 px-6 py-3">{b.dni}</td>
                  <td className="border border-gray-300 px-6 py-3">{b.telefono}</td>
                  <td className="border border-gray-300 px-6 py-3">{b.email}</td>
                  <td className="border border-gray-300 px-6 py-3 flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setSelectedBeneficiario(b);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDelete(b.beneficiarioid)} className="text-red-500 hover:text-red-700">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-4 text-gray-500">No hay beneficiarios para mostrar</td></tr>
            )}
          </tbody>
        </table>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-bold text-black mb-4">Editar Beneficiario</h2>
            {["nombre", "apellido", "dni", "email", "telefono"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field}
                className="w-full px-4 py-2 border border-gray-300 rounded-md my-2 bg-white text-black"
                value={selectedBeneficiario?.[field as keyof Beneficiario] || ""}
                onChange={handleInputChange}
              />
            ))}
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              className="w-full px-4 py-2 border border-gray-300 rounded-md my-2 bg-white text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleUpdate} className="mt-4 w-full bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold">
              Actualizar
            </button>
          </Modal>
        )}
      </div>
    </>
  );
};

export default MantenerBeneficiarios;
