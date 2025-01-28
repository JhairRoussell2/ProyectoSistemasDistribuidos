import { FiInfo, FiClipboard, FiSettings } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const GeneralDashboard = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-5xl font-bold text-center text-gray-100 mb-6">
          Panel General
        </h1>
        <p className="text-lg text-gray-400 text-center mb-8">
          Accede a información relevante y mantente actualizado con las funciones básicas del sistema.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Información General */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <FiInfo className="text-blue-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-blue-400">Información General</h2>
            <p className="text-gray-300 mt-2 text-center">
              Consulta información básica del sistema de gestión.
            </p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white">
              Ver Información
            </button>
          </div>

          {/* Registro de Siniestros */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <FiClipboard className="text-green-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-green-400">Registro de Siniestros</h2>
            <p className="text-gray-300 mt-2 text-center">
              Visualiza y consulta el estado de tus siniestros.
            </p>
            <a href="/registro-siniestro" className="mt-4 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white">
              Registrar Siniestro
            </a>
          </div>

          {/* Configuración de Cuenta */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <FiSettings className="text-yellow-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-yellow-400">Configuración</h2>
            <p className="text-gray-300 mt-2 text-center">
              Ajusta tus preferencias y opciones de cuenta.
            </p>
            <button className="mt-4 bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg text-white">
              Configurar Cuenta
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;