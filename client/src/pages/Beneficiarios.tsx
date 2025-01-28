import React, { useState, useEffect } from "react";
import axios from "axios";
import { PencilSquareIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";

// Define el tipo para los beneficiarios
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
  const [newBeneficiario, setNewBeneficiario] = useState({
    Nombre: "",
    Apellido: "",
    DNI: "",
    Email: "",
    Telefono: "",
  });

  // Obtener beneficiarios al cargar la página
  useEffect(() => {
    const fetchBeneficiarios = async () => {
      try {
        const response = await axios.get<Beneficiario[]>("http://localhost:3000/api/beneficiarios");
        setBeneficiarios(response.data);
        setFilteredBeneficiarios(response.data);
      } catch (error) {
        console.error("Error al obtener los beneficiarios:", error);
      }
    };
    fetchBeneficiarios();
  }, []);

  // Filtrar por DNI
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchDNI(value);
    const filtered = beneficiarios.filter((b) => b.DNI.includes(value));
    setFilteredBeneficiarios(filtered);
  };

  // Eliminar beneficiario
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

  // Manejo de cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBeneficiario({ ...newBeneficiario, [e.target.name]: e.target.value });
  };

  // Guardar nuevo beneficiario en la BD
  const handleSave = async () => {
    try {
      // Validación simple antes de enviar
      if (!newBeneficiario.Nombre || !newBeneficiario.Apellido || !newBeneficiario.DNI || !newBeneficiario.Email || !newBeneficiario.Telefono) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      const response = await axios.post("http://localhost:3000/api/beneficiarios", newBeneficiario);

      if (response.status === 201) {
        alert("Beneficiario agregado correctamente");

        // 🔄 Cerrar el modal y limpiar los campos
        setIsModalOpen(false);
        setNewBeneficiario({ Nombre: "", Apellido: "", DNI: "", Email: "", Telefono: "" });

        // 🔄 Actualizar la lista de beneficiarios en la tabla sin recargar la página
        setBeneficiarios([...beneficiarios, response.data]);
      }
    } catch (error) {
      console.error("Error al agregar beneficiario:", error);
      alert("No se pudo agregar el beneficiario.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-red-100 border border-gray-200 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-gray-700 text-center mb-8">
        Mantener Beneficiarios
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar por DNI"
          value={searchDNI}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
        />
        <button
          className="ml-4 bg-red-500 text-black font-bold px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlusIcon className="w-5 h-5" />
          <span>Agregar Beneficiario</span>
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-red-500 text-white">
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Apellido</th>
            <th className="border border-gray-300 px-4 py-2">DNI</th>
            <th className="border border-gray-300 px-4 py-2">Teléfono</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredBeneficiarios.map((b) => (
            <tr key={b.BeneficiarioID} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{b.Nombre}</td>
              <td className="border border-gray-300 px-4 py-2">{b.Apellido}</td>
              <td className="border border-gray-300 px-4 py-2">{b.DNI}</td>
              <td className="border border-gray-300 px-4 py-2">{b.Telefono}</td>
              <td className="border border-gray-300 px-4 py-2">{b.Email}</td>
              <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-4">
                <button onClick={() => alert(`Editar beneficiario: ${b.BeneficiarioID}`)}>
                  <PencilSquareIcon className="w-6 h-6 text-blue-600 hover:text-blue-800" />
                </button>
                <button onClick={() => handleDelete(b.BeneficiarioID)}>
                  <TrashIcon className="w-6 h-6 text-red-600 hover:text-red-800" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Agregar Beneficiario */}
      <Modal isOpen={isModalOpen} title="Agregar Beneficiario" onClose={() => setIsModalOpen(false)}>
        <input type="text" name="Nombre" placeholder="Nombre" className="w-full px-4 py-2 border rounded-md my-2 text-gray-900" onChange={handleInputChange} />
        <input type="text" name="Apellido" placeholder="Apellido" className="w-full px-4 py-2 border rounded-md my-2 text-gray-900" onChange={handleInputChange} />
        <input type="text" name="DNI" placeholder="DNI" className="w-full px-4 py-2 border rounded-md my-2 text-gray-900" onChange={handleInputChange} />
        <input type="email" name="Email" placeholder="Correo Electrónico" className="w-full px-4 py-2 border rounded-md my-2 text-gray-900" onChange={handleInputChange} />
        <input type="text" name="Telefono" placeholder="Teléfono" className="w-full px-4 py-2 border rounded-md my-2 text-gray-900" onChange={handleInputChange} />

        <div className="mt-4 flex justify-center">
          <button className="bg-red-500 text-black font-bold px-4 py-2 rounded-lg hover:bg-red-600" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MantenerBeneficiarios;