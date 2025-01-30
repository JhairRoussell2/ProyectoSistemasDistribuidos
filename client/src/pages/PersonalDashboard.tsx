import { FiCheckCircle, FiUsers, FiClipboard } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const PersonalDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-5xl font-bold text-center text-gray-100 mb-6">
          Panel de Personal
        </h1>
        <p className="text-lg text-gray-400 text-center mb-8">
          Administra las tareas asignadas y colabora en la gestión de siniestros.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Validar Poliza */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <FiCheckCircle className="text-blue-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-blue-400">Validar Poliza</h2>
            <p className="text-gray-300 mt-2 text-center">
              Revisa y valida las pólizas asignadas.
            </p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white"
              onClick={() => navigate('/dashboard/personal/validar-poliza')}
            >
              Ver Polizas
            </button>
          </div>

          {/* Gestión de Beneficiarios */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <FiUsers className="text-green-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-green-400">Gestión de Beneficiarios</h2>
            <p className="text-gray-300 mt-2 text-center">
              Administra los beneficiarios de siniestros.
            </p>
            <button className="mt-4 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
              onClick={() => navigate('/dashboard/personal/Mantener-Beneficiario')}>
              Gestionar Beneficiarios
            </button>
          </div>

          {/* Reportes de Actividad */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <FiClipboard className="text-yellow-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-yellow-400">Reportes de Actividad</h2>
            <p className="text-gray-300 mt-2 text-center">
              Revisa los reportes de tu actividad laboral.
            </p>
            <button className="mt-4 bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg text-white">
              Ver Reportes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PersonalDashboard;