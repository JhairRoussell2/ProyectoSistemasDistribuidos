import { FiFileText, FiDollarSign, FiBarChart2, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const AdminDashboard = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-5xl font-bold text-center text-gray-100 mb-6">
          Panel de <span className="text-blue-400">Administrador</span>
        </h1>
        <p className="text-lg text-gray-400 text-center mb-8">
          Administre recursos y procesos del sistema de siniestros vehiculares de manera eficiente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card
            icon={<FiFileText className="text-blue-400" />}
            title="Gestión de Presupuestos"
            description="Visualice, edite y apruebe presupuestos de siniestros."
            buttonText="Gestionar"
            buttonColor="bg-blue-600"
          />

          <Card
            icon={<FiDollarSign className="text-green-400" />}
            title="Pagos de Indemnización"
            description="Procese y registre pagos de indemnización a los beneficiarios."
            buttonText="Gestionar Pagos"
            buttonColor="bg-green-600"
          />

          <Card
            icon={<FiBarChart2 className="text-yellow-400" />}
            title="Generación de Reportes"
            description="Genere reportes detallados sobre siniestros y su gestión."
            buttonText="Ver Reportes"
            buttonColor="bg-yellow-600"
          />

          <Card
            icon={<FiShield className="text-red-400" />}
            title="Seguridad y Auditoría"
            description="Monitoree el acceso y las auditorías de seguridad del sistema."
            buttonText="Revisar Seguridad"
            buttonColor="bg-red-600"
          />

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
