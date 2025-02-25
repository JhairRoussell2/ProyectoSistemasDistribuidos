import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerDetalleSiniestroCompleto } from "../services/apiSeguimiento";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SeguimientoDetalle = () => {
  const { siniestroid } = useParams();
  const [siniestro, setSiniestro] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiniestroDetalle = async () => {
      try {
        const siniestroData = await obtenerDetalleSiniestroCompleto(siniestroid!);
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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-red-200 to-red-300 p-10">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-4xl font-bold text-red-700 text-center mb-8">
            📋 Detalle del Siniestro
          </h2>

          {/* Información General */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-red-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Información General</h3>
              <p><strong>Tipo de Siniestro:</strong> {siniestro?.siniestro?.tipo_siniestro}</p>
              <p><strong>Fecha del Siniestro:</strong> {new Date(siniestro?.siniestro?.fecha_siniestro).toLocaleDateString()}</p>
              <p><strong>Ubicación:</strong> {siniestro?.siniestro?.ubicacion}</p>
              <p><strong>Descripción:</strong> {siniestro?.siniestro?.descripcion}</p>
            </div>

            <div className="p-6 bg-red-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Información del Taller</h3>
              <p><strong>ID del Taller:</strong> {siniestro?.siniestro?.tallerid}</p>
              <p><strong>Nombre del Taller:</strong> {siniestro?.talleres?.[0]?.nombre_taller || 'No disponible'}</p>
              <p><strong>Dirección del Taller:</strong> {siniestro?.talleres?.[0]?.direccion || 'No disponible'}</p>
              <p><strong>Teléfono del Taller:</strong> {siniestro?.talleres?.[0]?.telefono || 'No disponible'}</p>
            </div>
          </div>

          {/* Información del Presupuesto */}
          <div className="p-6 bg-red-100 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Información del Presupuesto</h3>
            <p><strong>ID del Presupuesto:</strong> {siniestro?.presupuestos?.[0]?.presupuestoid}</p>
            <p><strong>Estado del Presupuesto:</strong> {siniestro?.presupuestos?.[0]?.estado}</p>
            <p><strong>Monto Total:</strong> S/. {siniestro?.presupuestos?.[0]?.montototal}</p>
            <p><strong>Costo de Reparación:</strong> S/. {siniestro?.presupuestos?.[0]?.costo_reparacion}</p>
            <p><strong>Costo de Piezas y Mano de Obra:</strong> S/. {siniestro?.presupuestos?.[0]?.costo_piezas_mano_obra}</p>
          </div>

          {/* Reclamaciones Asociadas */}
          <div className="p-6 bg-red-100 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Reclamaciones Asociadas</h3>
            {siniestro?.reclamaciones?.map((reclamacion: any) => (
              <div key={reclamacion.reclamacionid} className="mb-4">
                <p><strong>ID:</strong> {reclamacion.reclamacionid}</p>
                <p><strong>Fecha:</strong> {new Date(reclamacion.fecha_reclamacion).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {reclamacion.estado}</p>
                <p><strong>Descripción:</strong> {reclamacion.descripcion}</p>
                <p><strong>Tipo:</strong> {reclamacion.tipo}</p>
                {reclamacion.documentos && (
                  <div>
                    <strong>Documentos:</strong>
                    <ul>
                      {reclamacion.documentos.map((documento: any, index: number) => (
                        <li key={index}><a href={documento.url} target="_blank" rel="noopener noreferrer">Ver Documento</a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botón para regresar */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-gray-800 hover:bg-gray-900 text-white px-12 py-3 rounded-lg font-semibold flex items-center justify-center shadow-md transition-all duration-300"
              onClick={() => window.history.back()}
            >
              Regresar al Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeguimientoDetalle;
