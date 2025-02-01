import { FiCheckCircle, FiUsers, FiClipboard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import apiClient from '../services/apiClient';
import Layout from '../components/Layout'; // Asegúrate de importar Layout

const PersonalDashboard = () => {
  const navigate = useNavigate();

  // Función para generar el reporte de beneficiarios
  const generateBeneficiaryReport = async () => {
    try {
      const response = await apiClient.get('/api/beneficiarios');
      const beneficiarios = response.data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Beneficiarios');

      // Definir las columnas para el reporte con nombres personalizados
      worksheet.columns = [
        { header: 'ID Beneficiario', key: 'beneficiarioid' },
        { header: 'Nombre', key: 'nombre' },
        { header: 'Apellido', key: 'apellido' },
        { header: 'Email', key: 'email' },
        { header: 'Teléfono', key: 'telefono' },
        { header: 'DNI', key: 'dni' },
      ];

      // Personalizar los encabezados (headers)
      worksheet.getRow(1).eachCell((cell) => {
        // Color de fondo del header
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4CAF50' }, // color de fondo, en formato ARGB
        };

        // Color de texto
        cell.font = {
          color: { argb: 'FFFFFFFF' }, // color de la fuente (blanco)
          bold: true, // poner el texto en negrita
        };

        // Alineación del texto (opcional)
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      });

      // Agregar datos a las filas
      beneficiarios.forEach((beneficiario: any) => {
        worksheet.addRow(beneficiario);
      });

      // Escribir el archivo en formato Excel
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), 'Reporte_Beneficiarios.xlsx');

    } catch (error) {
      console.error('Error generando el reporte:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-6 mt-24">
        <h1 className="text-5xl font-extrabold text-center text-gray-100 mb-6">
          Panel de Personal
        </h1>
        <p className="text-lg text-gray-300 text-center mb-8">
          Administra las tareas asignadas y colabora en la gestión de siniestros.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Validar Poliza */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg shadow-lg p-6 flex flex-col items-center transform transition-all duration-300 hover:scale-105">
            <FiCheckCircle className="text-yellow-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-yellow-400">Validar Poliza</h2>
            <p className="text-gray-300 mt-2 text-center">
              Revisa y valida las pólizas asignadas.
            </p>
            <button
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg text-white transition duration-300 ease-in-out"
              onClick={() => navigate('/dashboard/personal/validar-poliza')}
            >
              Ver Polizas
            </button>
          </div>

          {/* Gestión de Beneficiarios */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow-lg p-6 flex flex-col items-center transform transition-all duration-300 hover:scale-105">
            <FiUsers className="text-yellow-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-yellow-400">Gestión de Beneficiarios</h2>
            <p className="text-gray-300 mt-2 text-center">
              Administra los beneficiarios de siniestros.
            </p>
            <button
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg text-white transition duration-300 ease-in-out"
              onClick={() => navigate('/dashboard/personal/Mantener-Beneficiario')}
            >
              Gestionar Beneficiarios
            </button>
          </div>

          {/* Reportes de Actividad */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg p-6 flex flex-col items-center transform transition-all duration-300 hover:scale-105">
            <FiClipboard className="text-yellow-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-yellow-400">Reportes de Actividad</h2>
            <p className="text-gray-300 mt-2 text-center">
              Revisa los reportes de tu actividad laboral.
            </p>
            <button
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg text-white transition duration-300 ease-in-out"
              onClick={generateBeneficiaryReport}
            >
              Generar Reporte de Beneficiarios
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default PersonalDashboard;
