import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

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
    setNewBeneficiario({ ...newBeneficiario, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (!newBeneficiario.Nombre || !newBeneficiario.Apellido || !newBeneficiario.DNI || !newBeneficiario.Email || !newBeneficiario.Telefono) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      const response = await axios.post("http://localhost:3000/api/beneficiarios", newBeneficiario);

      if (response.status === 201) {
        alert("Beneficiario agregado correctamente");
        setIsModalOpen(false);
        setNewBeneficiario({ Nombre: "", Apellido: "", DNI: "", Email: "", Telefono: "" });
        setBeneficiarios([...beneficiarios, response.data]);
      }
    } catch (error) {
      console.error("Error al agregar beneficiario:", error);
      alert("No se pudo agregar el beneficiario.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-white">
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
          <button
            className="ml-4 bg-red-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2"
            onClick={() => setIsModalOpen(true)}
          >
            Agregar Beneficiario
          </button>
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
                  <button className="text-blue-400 hover:underline" onClick={() => alert(`Editar beneficiario: ${b.BeneficiarioID}`)}>
                    Editar
                  </button>
                  <button className="text-red-400 hover:underline" onClick={() => handleDelete(b.BeneficiarioID)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-bold text-white mb-4">Agregar Beneficiario</h2>
            {["Nombre", "Apellido", "DNI", "Email", "Telefono"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field}
                className="w-full px-4 py-2 border border-gray-500 rounded-md my-2 bg-gray-800 text-white placeholder-gray-400"
                onChange={handleInputChange}
              />
            ))}
            <button
              onClick={handleSave}
              className="mt-4 w-full bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition"
            >
              Guardar
            </button>
          </Modal>
        )}
      </div>
    </>
  );
};

export default MantenerBeneficiarios;
