import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import Navbar from '../components/Navbar';

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
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-5xl font-bold text-center text-gray-100 mb-6">Validar Póliza</h1>
        
        {/* Search Input */}
        <div className="mb-6 flex justify-center space-x-4">
          <input
            type="text"
            placeholder="Buscar por DNI"
            value={searchDNI}
            onChange={(e) => setSearchDNI(e.target.value)}
            className="px-4 py-2 rounded-lg text-black w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg focus:outline-none"
          >
            Buscar
          </button>
        </div>

        {/* Back to Dashboard Button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg focus:outline-none mb-6"
          onClick={() => navigate('/dashboard/personal')}
        >
          Volver al Dashboard Personal
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {/* Polizas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polizas.map((poliza) => (
            <div key={poliza.polizaid} className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-400">{poliza.tipopoliza}</h2>
              <p className="text-gray-300 mt-2">ID: {poliza.polizaid}</p>
              <p className="text-gray-300 mt-2">Fecha de Inicio: {new Date(poliza.fechainicio).toLocaleDateString()}</p>
              <p className="text-gray-300 mt-2">Fecha de Fin: {new Date(poliza.fechafin).toLocaleDateString()}</p>
              <p className={`text-2xl mt-2 ${poliza.estado === 'Activa' ? 'text-green-500' : 'text-red-500'}`}>Estado: {poliza.estado}</p>
              
              {/* Only show the button if the policy is not active */}
              {poliza.estado !== 'Activa' && (
                <button
                  className="mt-4 px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleValidar(poliza.polizaid)}
                >
                  Validar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidarPoliza;
