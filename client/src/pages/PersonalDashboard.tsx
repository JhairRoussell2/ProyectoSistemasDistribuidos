import { useEffect, useState } from "react";
import { FiCheckCircle, FiUsers, FiClipboard } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import apiClient from "../services/apiClient";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import Layout from "../components/Layout";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const PersonalDashboard = () => {
  const [beneficiariosData, setBeneficiariosData] = useState([]);
  const [polizasData, setPolizasData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeneficiarios = async () => {
      try {
        const response = await apiClient.get("/api/beneficiarios");
        setBeneficiariosData(response.data);
      } catch (error) {
        setError("Error al obtener los beneficiarios");
      }
    };

    const fetchPolizas = async () => {
      try {
        const response = await apiClient.get("/api/polizas");
        setPolizasData(response.data);
      } catch (error) {
        setError("Error al obtener las pólizas");
      }
    };

    fetchBeneficiarios();
    fetchPolizas();
  }, []);

  // Generar el reporte de beneficiarios en Excel
  const generateBeneficiaryReport = async () => {
    try {
      const response = await apiClient.get("/api/beneficiarios");
      const beneficiarios = response.data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Beneficiarios");

      // Definir las columnas para el reporte con nombres personalizados
      worksheet.columns = [
        { header: "ID Beneficiario", key: "beneficiarioid" },
        { header: "Nombre", key: "nombre" },
        { header: "Apellido", key: "apellido" },
        { header: "Email", key: "email" },
        { header: "Teléfono", key: "telefono" },
        { header: "DNI", key: "dni" },
      ];

      // Agregar datos a las filas
      beneficiarios.forEach((beneficiario: any) => {
        worksheet.addRow(beneficiario);
      });

      // Escribir el archivo en formato Excel
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "Reporte_Beneficiarios.xlsx");
    } catch (error) {
      console.error("Error generando el reporte:", error);
    }
  };

  // Precios predeterminados para cada tipo de póliza
  const policyPrices = {
    Básica: 10,  // S/10
    Normal: 25,  // S/25
    Premium: 50, // S/50
  };

  // Datos para el gráfico de barras de pólizas por tipo y precio
  const polizaChartData = {
    labels: ["Póliza Básica", "Póliza Normal", "Póliza Premium"],
    datasets: [
      {
        label: "Costo Total de Pólizas por Tipo",
        data: [
          polizasData.filter((p: any) => p.tipopoliza === "Básica").length * policyPrices.Básica,
          polizasData.filter((p: any) => p.tipopoliza === "Normal").length * policyPrices.Normal,
          polizasData.filter((p: any) => p.tipopoliza === "Premium").length * policyPrices.Premium,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
      },
    ],
  };

  // Datos para el gráfico Doughnut de total de beneficiarios
  const totalBeneficiariosData = {
    labels: ["Total de Beneficiarios"],
    datasets: [
      {
        label: "Total de Beneficiarios",
        data: [beneficiariosData.length],
        backgroundColor: ["#FF6384"],
      },
    ],
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-6 mt-auto">
        <h1 className="text-5xl font-extrabold text-center text-white mb-4 shadow-md">Panel de Personal</h1>
        <p className="text-lg text-gray-300 text-center mb-8 max-w-2xl mx-auto">
          Administra las tareas asignadas y colabora en la gestión de siniestros.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Distribución de Pólizas por Tipo y Precio */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Costo Total de Pólizas por Tipo</h2>
            <Bar
              data={polizaChartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Distribución del Costo de Pólizas",
                  },
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>

          {/* Gráfico Doughnut de Total de Beneficiarios */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Total de Beneficiarios</h2>
            <Doughnut
              data={totalBeneficiariosData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Total de Beneficiarios en el Sistema",
                  },
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PersonalDashboard;
