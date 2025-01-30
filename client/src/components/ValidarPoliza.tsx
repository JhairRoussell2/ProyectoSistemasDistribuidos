import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import Navbar from '../components/Navbar';

interface Poliza {
  PolizaID: number;
  BeneficiarioID: number;
  TipoPoliza: string;
  FechaInicio: string;
  FechaFin: string;
  Estado: string;
  // otros campos relevantes
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
        console.log(response.data); // Añade esta línea para depurar la respuesta de la API
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
          poliza.PolizaID === polizaID ? { ...poliza, Estado: 'Activa' } : poliza
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
        <h1 className="text-5xl font-bold text-center text-gray-100 mb-6">
          Validar Poliza
        </h1>
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Buscar por DNI"
            value={searchDNI}
            onChange={(e) => setSearchDNI(e.target.value)}
            className="px-4 py-2 rounded-lg text-black"
          />
          <button
            onClick={handleSearch}
            className="ml-4 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white"
          >
            Buscar
          </button>
        </div>
        <button
          className="mb-6 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white"
          onClick={() => navigate('/dashboard/personal')}
        >
          Volver al Dashboard Personal
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polizas.map((poliza) => (
            <div key={poliza.PolizaID} className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-blue-400">{poliza.TipoPoliza}</h2>
              <p className='text-gray-300 mt-2'>ID: {poliza.PolizaID}</p>
              <p className="text-gray-300 mt-2">Fecha de Inicio: {new Date(poliza.FechaInicio).toLocaleDateString()}</p>
              <p className="text-gray-300 mt-2">Fecha de Fin: {new Date(poliza.FechaFin).toLocaleDateString()}</p>
              <p className="text-gray-300 mt-2">Estado: {poliza.Estado}</p>
              <button
                className={`mt-4 px-5 py-2 rounded-lg text-white ${poliza.Estado === 'Activa' ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={() => handleValidar(poliza.PolizaID)}
                disabled={poliza.Estado === 'Activa'}
              >
                Validar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidarPoliza;