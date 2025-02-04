import Layout from '../components/Layout';
import ChartCard from '../components/ChartCard';
import { FaUserShield } from 'react-icons/fa'; // Importamos un ícono de Administrador

const AdminDashboard = () => {
  const fetchSiniestrosData = async () => {
    return {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Siniestros',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const fetchPagosData = async () => {
    return {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Pagos',
          data: [1500, 2300, 1800, 2200, 2000, 2500],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const fetchReportesData = async () => {
    return {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Reportes',
          data: [5, 9, 7, 8, 6, 10],
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const fetchAuditoriasData = async () => {
    return {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Auditorías',
          data: [2, 3, 1, 4, 2, 3],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Siniestros por Mes',
      },
    },
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-6 bg-white">
        {/* Contenedor negro con ícono */}
        <div className="bg-black text-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-5xl font-bold text-center flex items-center justify-center text-white mb-6">
            <FaUserShield className="mr-4 text-yellow-400" />
            Panel de <span className="text-blue-400">Administrador</span>
          </h1>
          <p className="text-lg text-gray-400 text-center mb-8">
            Administre recursos y procesos del sistema de siniestros vehiculares de manera eficiente.
          </p>
        </div>

        {/* Sección de tarjetas con gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ChartCard title="Siniestros por Mes" fetchData={fetchSiniestrosData} chartOptions={chartOptions} />
          <ChartCard title="Pagos de Indemnización" fetchData={fetchPagosData} chartOptions={chartOptions} />
          <ChartCard title="Reportes Generados" fetchData={fetchReportesData} chartOptions={chartOptions} />
          <ChartCard title="Auditorías de Seguridad" fetchData={fetchAuditoriasData} chartOptions={chartOptions} />
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
