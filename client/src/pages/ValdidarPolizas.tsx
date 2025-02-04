import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import Navbar from '../components/Navbar';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

interface Poliza {
  polizaid: number;
  beneficiarioid: number;
  tipopoliza: string;
  fechainicio: string;
  fechafin: string;
  estado: string;
}

const ValidarPoliza = () => {
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchDNI, setSearchDNI] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolizas = async () => {
      try {
        const response = await apiClient.get('/api/polizas');
        if (Array.isArray(response.data)) {
          setPolizas(response.data);
        } else if (response.data && typeof response.data === 'object') {
          setPolizas([response.data]);
        } else {
          throw new Error('La respuesta de la API no es válida');
        }
      } catch (error) {
        console.error('Error al obtener las pólizas:', error);
        setError('Error al obtener las pólizas');
      }
    };

    fetchPolizas();
  }, []);

  const handleSearch = async () => {
    if (searchDNI.trim() === "") {
      setError("Por favor, ingrese un DNI válido.");
      return;
    }

    try {
      const response = await apiClient.get(`/api/polizas/validar/${searchDNI}`);
      setPolizas(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al buscar la póliza por DNI:', error);
      setError('No se pudo encontrar la póliza con el DNI proporcionado.');
      setPolizas([]);
    }
  };

  const handleValidar = async (polizaID: number) => {
    try {
      await apiClient.put(`/api/polizas/${polizaID}/estado`, { estado: 'Activa' });
      setPolizas((prevPolizas) =>
        prevPolizas.map((poliza) =>
          poliza.polizaid === polizaID ? { ...poliza, estado: 'Activa' } : poliza
        )
      );
    } catch (error) {
      console.error('Error al validar la póliza:', error);
      alert('No se pudo validar la póliza.');
    }
  };

  return (
    <div className="bg-white min-h-screen text-black relative overflow-hidden">
      <Navbar />

      {/* Fondo con matices sutiles */}
      <div className="absolute inset-0 bg-red-100 opacity-90"></div>


      <div className="relative max-w-6xl mx-auto py-12 px-6 mt-16 bg-white shadow-2xl rounded-xl border border-gray-200">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8">
          Validar <span className="text-red-600">Póliza</span>
        </h1>

        {/* Search Input */}
        <div className="mb-8 flex justify-center items-center space-x-4">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Buscar por DNI"
              value={searchDNI}
              onChange={(e) => setSearchDNI(e.target.value)}
              className="w-full pl-12 p-3 border border-gray-300 rounded-lg text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-sm"
            />
            <FaSearch className="absolute left-4 top-4 text-gray-500" />
          </div>
          <button
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 shadow-md transition-all"
          >
            <FaSearch /> <span>Buscar</span>
          </button>
        </div>

        {/* Back to Dashboard Button */}
        <button
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center space-x-2 shadow-md mb-6"
          onClick={() => navigate('/dashboard/personal')}
        >
          <FaArrowLeft /> <span>Volver al Dashboard</span>
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {/* Pólizas Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-3 px-6 text-left">ID Póliza</th>
                <th className="py-3 px-6 text-left">Tipo de Póliza</th>
                <th className="py-3 px-6 text-left">Fecha de Inicio</th>
                <th className="py-3 px-6 text-left">Fecha de Fin</th>
                <th className="py-3 px-6 text-center">Estado</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {polizas.length > 0 ? (
                polizas.map((poliza) => (
                  <tr key={poliza.polizaid} className="border-t border-gray-300 hover:bg-gray-50">
                    <td className="py-4 px-6">{poliza.polizaid}</td>
                    <td className="py-4 px-6">{poliza.tipopoliza}</td>
                    <td className="py-4 px-6">{new Date(poliza.fechainicio).toLocaleDateString()}</td>
                    <td className="py-4 px-6">{new Date(poliza.fechafin).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-center">
                      {poliza.estado === 'Activa' ? (
                        <span className="text-green-600 flex items-center justify-center space-x-2">
                          <FaCheckCircle /> <span>Activa</span>
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center justify-center space-x-2">
                          <FaTimesCircle /> <span>Inactiva</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {poliza.estado !== 'Activa' && (
                        <button
                          className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 flex items-center space-x-2 shadow-md"
                          onClick={() => handleValidar(poliza.polizaid)}
                        >
                          <FaCheckCircle /> <span>Validar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No hay pólizas disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default ValidarPoliza;
