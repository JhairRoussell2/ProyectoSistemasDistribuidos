import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Policies = () => {
  const navigate = useNavigate();
  const { user, createPolicy } = useAuth();
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPolicy = async (policy: string) => {
    if (user) {
      setSelectedPolicy(policy);

      try {
        await createPolicy(user.UsuarioID, policy); // Crear la póliza con la función del contexto
        navigate('/dashboard/general');  // Redirigir después de la creación exitosa
      } catch (error) {
        setErrorMessage('Error al crear la póliza. Intenta nuevamente.');
        console.error('Error en la creación de póliza:', error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white min-h-screen flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-indigo-500">Elige tu Póliza</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Basic Policy Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Póliza Básica</h3>
          <p className="text-gray-600 mb-4">Cobertura básica con beneficios esenciales para ti.</p>
          <p className="text-lg font-semibold mb-4 text-gray-800">Costo: <span className="text-green-600">$10 / mes</span></p>
          <button
            onClick={() => handleSelectPolicy('Básica')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Elegir Póliza
          </button>
        </div>

        {/* Normal Policy Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Póliza Normal</h3>
          <p className="text-gray-600 mb-4">Cobertura intermedia con mayores beneficios y atención preferencial.</p>
          <p className="text-lg font-semibold mb-4 text-gray-800">Costo: <span className="text-green-600">$25 / mes</span></p>
          <button
            onClick={() => handleSelectPolicy('Normal')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Elegir Póliza
          </button>
        </div>

        {/* Premium Policy Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Póliza Premium</h3>
          <p className="text-gray-600 mb-4">Cobertura premium con atención personalizada y todos los beneficios.</p>
          <p className="text-lg font-semibold mb-4 text-gray-800">Costo: <span className="text-green-600">$50 / mes</span></p>
          <button
            onClick={() => handleSelectPolicy('Premium')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Elegir Póliza
          </button>
        </div>
      </div>

      {/* Mostrar la póliza seleccionada */}
      {selectedPolicy && (
        <div className="mt-8 text-center">
          <p className="text-lg font-bold">Has seleccionado: <span className="text-indigo-400">{selectedPolicy}</span></p>
          <button
            onClick={() => navigate('/dashboard/general')}
            className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold transition"
          >
            Volver al Dashboard
          </button>
        </div>
      )}

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
      )}
    </div>
  );
};

export default Policies;
