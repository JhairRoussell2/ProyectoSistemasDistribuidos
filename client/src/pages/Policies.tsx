import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Policies = () => {
  const navigate = useNavigate();
  const { user, createPolicy } = useAuth();  // Destructure createPolicy function from useAuth
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPolicy = async (policy: string) => {
    if (user) {
      setSelectedPolicy(policy);

      try {
        // Use the createPolicy function from useAuth to create the policy
        await createPolicy(user.UsuarioID, policy);
        navigate('/dashboard');  // Redirect after successful policy creation
      } catch (error) {
        setErrorMessage('Error al crear la póliza. Intenta nuevamente.');
        console.error('Error en la creación de póliza:', error);
      }
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-6">Elige tu Póliza</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Policy Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold mb-4">Póliza Básica</h3>
          <p className="mb-4">Cobertura básica con beneficios esenciales para ti.</p>
          <p className="text-lg font-semibold mb-4">Costo: $10 / mes</p>
          <button
            onClick={() => handleSelectPolicy('Básica')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold transition"
          >
            Elegir Póliza
          </button>
        </div>

        {/* Normal Policy Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold mb-4">Póliza Normal</h3>
          <p className="mb-4">Cobertura intermedia con mayores beneficios y atención preferencial.</p>
          <p className="text-lg font-semibold mb-4">Costo: $25 / mes</p>
          <button
            onClick={() => handleSelectPolicy('Normal')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold transition"
          >
            Elegir Póliza
          </button>
        </div>

        {/* Premium Policy Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold mb-4">Póliza Premium</h3>
          <p className="mb-4">Cobertura premium con atención personalizada y todos los beneficios.</p>
          <p className="text-lg font-semibold mb-4">Costo: $50 / mes</p>
          <button
            onClick={() => handleSelectPolicy('Premium')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold transition"
          >
            Elegir Póliza
          </button>
        </div>
      </div>

      {/* Show selected policy */}
      {selectedPolicy && (
        <div className="mt-6">
          <p className="text-lg font-bold">Has seleccionado: {selectedPolicy}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition"
          >
            Volver a la página principal
          </button>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="mt-4 text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default Policies;
