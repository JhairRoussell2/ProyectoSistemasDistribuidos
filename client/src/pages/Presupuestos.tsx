import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";

const API_PRESUPUESTOS_URL =
  import.meta.env.VITE_API_PRESUPUESTOS_URL || "http://localhost:5002/api/presupuesto-pagos";

const Presupuestos = () => {
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPresupuestos();
  }, []);

  const fetchPresupuestos = async () => {
    try {
      const response = await fetch(API_PRESUPUESTOS_URL);
      const data = await response.json();
      setPresupuestos(data);
    } catch (error) {
      setAlert({ type: "error", message: "Error al obtener presupuestos" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 min-h-screen bg-gradient-to-br from-white via-gray-100 to-red-50 text-gray-900 pt-24">
        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">📋 Presupuestos</h1>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          <table className="w-full border border-gray-200 text-gray-800">
            <thead className="bg-gradient-to-r from-red-500 to-red-400 text-white uppercase text-sm tracking-wide">
              <tr>
                <th className="p-3 text-center">Siniestro ID</th>
                <th className="p-3 text-center">Fecha Asignación</th>
                <th className="p-3 text-center">Taller</th>
                <th className="p-3 text-center">Tipo Siniestro</th>
                <th className="p-3 text-center">Placa</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {presupuestos.map((presupuesto: any) => (
                <tr key={presupuesto.presupuestoid} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 text-center">{"SIN-0"+presupuesto.siniestroid}</td>
                  <td className="p-3 text-center">
                    {presupuesto.fecha_asignacion
                      ? new Date(presupuesto.fecha_asignacion).toLocaleString()
                      : "No asignada"}
                  </td>
                  <td className="p-3 text-center">{presupuesto.nombre || "N/A"}</td>
                  <td className="p-3 text-center">{presupuesto.tipo_siniestro}</td>
                  <td className="p-3 text-center">{presupuesto.placa || "N/A"}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => navigate(`/detallepresupuesto/${presupuesto.presupuestoid}`)}
                      className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition mx-auto"
                    >
                      <Eye size={16} />
                      Validar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Presupuestos;
