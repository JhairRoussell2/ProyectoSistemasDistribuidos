import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

interface Siniestro {
  siniestroid: number;
  beneficiarioid: number;
  tipo_siniestro: string;
  fecha_siniestro: string;
  tallerid?: number | null;
}

interface Taller {
  tallerid: number;
  nombre: string;
  capacidad: number;
  direccion: string;
  estado: string;
}

const AsignarTaller = () => {
  const navigate = useNavigate();
  const [siniestros, setSiniestros] = useState<Siniestro[]>([]);
  const [siniestrosFiltrados, setSiniestrosFiltrados] = useState<Siniestro[]>([]);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filtro, setFiltro] = useState("normal"); // Estado del filtro
  const [selectedSiniestro, setSelectedSiniestro] = useState<number | null>(null);
  const [selectedTaller, setSelectedTaller] = useState<number | null>(null);
  const [searchBeneficiario, setSearchBeneficiario] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siniestrosResponse, talleresResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/siniestros"),
          axios.get("http://localhost:5001/api/talleres"),
        ]);
        const talleresDisponibles = talleresResponse.data.filter((taller: Taller) => taller.estado !== "Ocupado");
        setSiniestros(siniestrosResponse.data);
        setTalleres(talleresDisponibles);
        setSiniestrosFiltrados(siniestrosResponse.data);
      } catch (error) {
        setError("Error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Manejo del filtro
  useEffect(() => {
    let filtrados = siniestros;
    if (filtro === "no_asignados") {
      filtrados = filtrados.filter((siniestro) => !siniestro.tallerid);
    } else if (filtro === "asignados") {
      filtrados = filtrados.filter((siniestro) => siniestro.tallerid);
    }
    
    if (searchBeneficiario) {
      filtrados = filtrados.filter((siniestro) =>
        siniestro.beneficiarioid.toString().includes(searchBeneficiario)
      );
    }
    setSiniestrosFiltrados(filtrados);
  }, [filtro, siniestros, searchBeneficiario]);

  const handleAsignarClick = (siniestroid: number) => {
    setSelectedSiniestro(siniestroid);
    setSelectedTaller(null);
  };

  const handleConfirmAsignar = async () => {
    if (selectedSiniestro !== null && selectedTaller !== null) {
      try {
        await axios.put("http://localhost:3000/api/siniestros/asignar", {
          siniestroid: selectedSiniestro,
          tallerid: selectedTaller,
        });
        setSelectedSiniestro(null);
        setSuccessMessage("✅ Taller asignado exitosamente.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error al asignar el taller:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-red-200 to-red-300 p-6">
      <Navbar />

      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out z-50">
          {successMessage}
        </div>
      )}
      <div className="flex flex-grow justify-center items-center p-10">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-6xl lg:text-5xl font-extrabold text-center mb-10 tracking-wide uppercase bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">
            ASIGNAR TALLER A SINIESTRO
          </h1>

          {loading && <p className="text-center">Cargando datos...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* Buscador por ID de Beneficiario */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="w-2/3">
              <label className="block text-gray-700 font-semibold mb-2">Buscar por ID de Beneficiario</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring focus:ring-red-200"
                placeholder="Ingrese ID de Beneficiario"
                value={searchBeneficiario}
                onChange={(e) => setSearchBeneficiario(e.target.value)}
              />
            </div>
            <div className="w-2/3">
              <label className="block text-gray-700 font-semibold mb-2">Filtrar siniestros</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring focus:ring-red-200"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="no_asignados">No asignados</option>
                <option value="asignados">Asignados</option>
              </select>
            </div>
          </div>

          {/* Tabla de siniestros */}
          <div className="max-h-96 overflow-y-auto relative border border-gray-300 shadow-md rounded-lg" ref={tableRef}>
            <table className="w-full bg-white">
              <thead className="bg-red-500 text-white sticky top-0 z-10">
                <tr>
                  <th className="border p-3 text-left w-1/12">ID</th>
                  <th className="border p-3 text-left w-5/12">Tipo de Siniestro</th>
                  <th className="border p-3 text-left w-3/12">Fecha</th>
                  <th className="border p-3 text-left w-1/12">idBeneficiario</th>
                  <th className="border p-3 text-center w-3/12">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {siniestrosFiltrados.map((siniestro) => (
                  <tr key={siniestro.siniestroid} className="hover:bg-gray-100">
                    <td className="border p-3 w-1/12">{siniestro.siniestroid}</td>
                    <td className="border p-3 w-3/12">{siniestro.tipo_siniestro}</td>
                    <td className="border p-3 w-2/12">{new Date(siniestro.fecha_siniestro).toLocaleDateString()}</td>
                    <td className="border p-3 w-1/12">{siniestro.beneficiarioid}</td>
                    <td className="border p-3 text-center w-4/12">
                      <button
                        onClick={() => handleAsignarClick(siniestro.siniestroid)}
                        className={`px-4 py-2 rounded-lg transition duration-300 ${
                          siniestro.tallerid
                            ? "bg-green-600 text-white hover:bg-green-800"
                            : "bg-blue-600 text-white hover:bg-blue-800"
                        }`}
                      >
                        {siniestro.tallerid ? "Cambiar Taller" : "Asignar Taller"}
                      </button>

                      {/* Selector de taller solo si este siniestro está seleccionado */}
                      {selectedSiniestro === siniestro.siniestroid && (
                        <div className="mt-4">
                          <label className="block text-gray-700 font-semibold mb-2">Seleccionar Taller</label>
                          <select
                            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700"
                            value={selectedTaller || ""}
                            onChange={(e) => setSelectedTaller(Number(e.target.value))}
                          >
                            <option value="">Seleccione un taller</option>
                            {talleres.map((taller) => (
                              <option key={taller.tallerid} value={taller.tallerid}>
                                {taller.nombre} - Capacidad: {taller.capacidad} - Direccion: {taller.direccion}
                              </option>
                            ))}
                          </select>
                          <div className="flex justify-end space-x-2 mt-4">
                            <button
                              onClick={() => setSelectedSiniestro(null)}
                              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleConfirmAsignar}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
                            >
                              Confirmar
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contenedor de botones debajo del mapa */}
            <div className="flex justify-center w-1/2 mt-6">
      <button
          onClick={() => navigate("/dashboard/personal")}
          className="bg-gray-600 text-white font-bold px-12 py-4 rounded-lg text-lg w-1/2 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700"
        >
          Regresar al Dashboard
        </button>
      </div>          


    </div>

    
  );
};

export default AsignarTaller;
