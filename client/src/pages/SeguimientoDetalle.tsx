import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerDetalleSiniestroCompleto } from "../services/apiSeguimiento";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Info, DollarSign, Building, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";

const SeguimientoDetalle = () => {
  const { siniestroid } = useParams();
  const [siniestro, setSiniestro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSiniestroDetalle = async () => {
      try {
        const siniestroData = await obtenerDetalleSiniestroCompleto(
          siniestroid!
        );
        setSiniestro(siniestroData);
      } catch (error) {
        console.error("Error al cargar los detalles del siniestro");
      } finally {
        setLoading(false);
      }
    };

    if (siniestroid) {
      fetchSiniestroDetalle();
    }
  }, [siniestroid]);

  if (loading) return <div>Cargando...</div>;

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-red-100 via-red-200 to-red-300 p-18">
        <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-xl border border-gray-200">
          {/* Encabezado */}
          <div className="bg-red-600 text-white text-center py-6 rounded-md shadow-md">
            <h2 className="text-5xl font-bold">Detalle del Seguimiento</h2>
            <p className="text-sm text-gray-200">
              Consulta toda la información de tu siniestro de manera clara y
              profesional.
            </p>
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[
              {
                title: "Información General",
                icon: <Info size={20} />,
                content: siniestro?.siniestro ? (
                  <>
                    <p>
                      <strong>Tipo de Siniestro:</strong>{" "}
                      {siniestro.siniestro.tipo_siniestro}
                    </p>
                    <p>
                      <strong>Fecha del Siniestro:</strong>{" "}
                      {new Date(
                        siniestro.siniestro.fecha_siniestro
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Ubicación:</strong>{" "}
                      {siniestro.siniestro.ubicacion}
                    </p>
                    <p>
                      <strong>Descripción:</strong>{" "}
                      {siniestro.siniestro.descripcion}
                    </p>
                  </>
                ) : (
                  <p>No se encontró información general.</p>
                ),
              },
              {
                title: "Información del Presupuesto",
                icon: <DollarSign size={20} />,
                content:
                  siniestro?.presupuestos?.length > 0 ? (
                    <>
                      <p>
                        <strong>ID del Presupuesto:</strong>{" "}
                        {siniestro.presupuestos[0].presupuestoid}
                      </p>
                      <p>
                        <strong>Estado del Presupuesto:</strong>{" "}
                        {siniestro.presupuestos[0].estado}
                      </p>
                      <p>
                        <strong>Monto Total:</strong> S/.{" "}
                        {siniestro.presupuestos[0].montototal}
                      </p>
                    </>
                  ) : (
                    <p>No se encontraron presupuestos asociados.</p>
                  ),
              },
              {
                title: "Información del Taller",
                icon: <Building size={20} />,
                content:
                  siniestro?.talleres?.length > 0 ? (
                    <>
                      <p>
                        <strong>ID del Taller:</strong>{" "}
                        {siniestro.siniestro.tallerid}
                      </p>
                      <p>
                        <strong>Nombre del Taller:</strong>{" "}
                        {siniestro.talleres[0].nombre_taller}
                      </p>
                      <p>
                        <strong>Dirección del Taller:</strong>{" "}
                        {siniestro.talleres[0].direccion}
                      </p>
                      <p>
                        <strong>Teléfono del Taller:</strong>{" "}
                        {siniestro.talleres[0].telefono}
                      </p>
                    </>
                  ) : (
                    <p>No se encontraron talleres asociados.</p>
                  ),
              },
              {
                title: "Reclamaciones Asociadas",
                icon: <FileText size={20} />,
                content:
                  siniestro?.reclamaciones?.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2">ID</th>
                          <th className="border border-gray-300 p-2">Fecha</th>
                          <th className="border border-gray-300 p-2">Estado</th>
                          <th className="border border-gray-300 p-2">
                            Descripción
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {siniestro.reclamaciones.map((reclamacion: any) => (
                          <tr
                            key={reclamacion.reclamacionid}
                            className="text-center"
                          >
                            <td className="border border-gray-300 p-2">
                              {reclamacion.reclamacionid}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {new Date(
                                reclamacion.fecha_reclamacion
                              ).toLocaleDateString()}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {reclamacion.estado}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {reclamacion.descripcion}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No se encontraron reclamaciones asociadas.</p>
                  ),
              },
            ].map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg border border-gray-300 hover:shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-red-500 text-white text-lg font-semibold p-3 flex items-center gap-2 rounded-t-lg">
                  {section.icon} {section.title}
                </div>
                <div className="p-4 text-gray-800">{section.content}</div>
              </div>
            ))}
          </div>

          {/* Botón de regreso */}
          <div className="flex justify-center mt-6 gap-6">
            <button
              className="bg-red-600 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <IoArrowBack size={20} /> Elegir otro siniestro
            </button>

            <button
              type="button"
              className="bg-[#1f2937] hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
              onClick={() => navigate("/dashboard/general")}
            >
              <MdDashboard className="text-lg" /> Regresar al Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeguimientoDetalle;
