import { FiInfo, FiClipboard, FiSettings, FiHome } from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import Layout from "../components/Layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const GeneralDashboard = () => {
  // Datos simulados para los gráficos
  const barData = {
    labels: ["Siniestros Atendidos", "Siniestros Pendientes"],
    datasets: [
      {
        label: "Cantidad",
        data: [120, 30],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderColor: ["#388E3C", "#D32F2F"],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Vehículos Reparados", "En Espera"],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ["#03A9F4", "#FFC107"],
        borderColor: ["#0288D1", "#FFA000"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-5xl font-bold text-center text-gray-100 mb-6">
          Panel General
        </h1>
        <p className="text-lg text-gray-400 text-center mb-8">
          Accede a información relevante y mantente actualizado con las funciones básicas del sistema.
        </p>

        {/* Sección de gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-center text-white mb-4">
              Estado de Siniestros
            </h2>
            <Bar data={barData} />
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-center text-white mb-4">
              Estado de Vehículos
            </h2>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GeneralDashboard;