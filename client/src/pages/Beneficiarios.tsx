import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

interface Beneficiario {
  BeneficiarioID: number;
  Nombre: string;
  Apellido: string;
  Email: string;
  Telefono: string;
  DNI: string;
}

const MantenerBeneficiarios = () => {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [filteredBeneficiarios, setFilteredBeneficiarios] = useState<Beneficiario[]>([]);
  const [searchDNI, setSearchDNI] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null);
  const [password, setPassword] = useState(""); // 🔹 Nuevo estado para la contraseña

  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    const fetchBeneficiarios = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/beneficiarios");
        const data = response.data[0]; // Extrae los datos del array anidado
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
    setSearchDNI(value);
    const filtered = beneficiarios.filter((b) => b.DNI.includes(value));
    setFilteredBeneficiarios(filtered);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/beneficiarios/${id}`);
      alert("Beneficiario eliminado correctamente");
      const updatedList = beneficiarios.filter((b) => b.BeneficiarioID !== id);
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

    const { BeneficiarioID, ...datosActualizados } = selectedBeneficiario;
    console.log("Datos a actualizar:", datosActualizados);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/beneficiarios/${selectedBeneficiario.BeneficiarioID}`,
        { ...datosActualizados, Password: password } // 🔹 Enviar la contraseña para la validación
      );

      if (response.status === 200) {
        alert("Beneficiario actualizado correctamente");

        const updatedBeneficiarios = beneficiarios.map((b) =>
          b.BeneficiarioID === selectedBeneficiario.BeneficiarioID ? { ...selectedBeneficiario } : b
        );

        setBeneficiarios(updatedBeneficiarios);
        setFilteredBeneficiarios(updatedBeneficiarios);
        setIsModalOpen(false);
        setPassword(""); // 🔹 Limpiar el campo de contraseña después de actualizar
      }
    } catch (error) {
      console.error("Error al actualizar beneficiario:", error);
      alert("No se pudo actualizar el beneficiario.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-white">
        {/* Botón de retroceso */}
        <button
          onClick={() => navigate("/dashboard/personal")}
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeftIcon className="w-6 h-6 mr-2" />
          <span>Volver</span>
        </button>

        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Mantener Beneficiarios
        </h1>

        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar por DNI"
            value={searchDNI}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-500 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:ring focus:ring-red-500 focus:outline-none"
          />
        </div>

        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-red-500 text-white">
              <th className="border border-gray-700 px-4 py-2">Nombre</th>
              <th className="border border-gray-700 px-4 py-2">Apellido</th>
              <th className="border border-gray-700 px-4 py-2">DNI</th>
              <th className="border border-gray-700 px-4 py-2">Teléfono</th>
              <th className="border border-gray-700 px-4 py-2">Email</th>
              <th className="border border-gray-700 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeneficiarios.map((b) => (
              <tr key={b.BeneficiarioID} className="text-center bg-gray-800">
                <td className="border border-gray-700 px-4 py-2">{b.Nombre}</td>
                <td className="border border-gray-700 px-4 py-2">{b.Apellido}</td>
                <td className="border border-gray-700 px-4 py-2">{b.DNI}</td>
                <td className="border border-gray-700 px-4 py-2">{b.Telefono}</td>
                <td className="border border-gray-700 px-4 py-2">{b.Email}</td>
                <td className="border border-gray-700 px-4 py-2 flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedBeneficiario(b);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    Editar
                  </button>
                  <button onClick={() => handleDelete(b.BeneficiarioID)} className="text-red-400 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-bold text-white mb-4">Editar Beneficiario</h2>
            {["Nombre", "Apellido", "DNI", "Email", "Telefono"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field}
                className="w-full px-4 py-2 border border-gray-500 rounded-md my-2 bg-gray-800 text-white"
                value={selectedBeneficiario?.[field as keyof Beneficiario] || ""}
                onChange={handleInputChange}
              />
            ))}
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              className="w-full px-4 py-2 border border-gray-500 rounded-md my-2 bg-gray-800 text-white"
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