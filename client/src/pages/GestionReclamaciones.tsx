import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerReclamaciones, actualizarEstadoReclamacion, eliminarReclamacion, validarDocumentos } from "../services/apiGestionReclamaciones";

interface Reclamacion {
  reclamacionid: number;
  estado: string;
  descripcion: string;
  tipo: string;
  documentos: Array<{
    documentoId: number;
    nombre: string;
    extension: string;
    url: string;
    fechaSubida: string;
    estado_documento: string;
  }>;
}

const GestionarReclamaciones: React.FC = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [reclamaciones, setReclamaciones] = useState<Reclamacion[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("");
  const [reclamacionIdParaEstado, setReclamacionIdParaEstado] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reclamacionesData = await obtenerReclamaciones();
        setReclamaciones(reclamacionesData);
      } catch (error) {
        setAlert({ type: "error", message: "Error al cargar las reclamaciones" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleActualizarEstado = async (id: number, estado: string) => {
    try {
      setLoading(true);
      await actualizarEstadoReclamacion(id.toString(), estado);
      setAlert({ type: "success", message: "Estado de la reclamación actualizado con éxito" });
      const updatedReclamaciones = await obtenerReclamaciones();
      setReclamaciones(updatedReclamaciones);
    } catch (error) {
      setAlert({ type: "error", message: "Error al actualizar el estado de la reclamación" });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarReclamacion = async (id: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta reclamación?")) {
      try {
        setLoading(true);
        await eliminarReclamacion(id.toString());
        setAlert({ type: "success", message: "Reclamación eliminada con éxito" });
        const updatedReclamaciones = await obtenerReclamaciones();
        setReclamaciones(updatedReclamaciones);
      } catch (error) {
        setAlert({ type: "error", message: "Error al eliminar la reclamación" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleValidarDocumentos = (id: number) => {
    navigate(`/validar-reclamacion/${id}`);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>Gestionar Reclamaciones</h2>
      {loading && <div>Loading...</div>}
      {alert && (
        <div style={{ backgroundColor: alert.type === "success" ? 'green' : 'red', color: 'white', padding: '10px', marginBottom: '10px' }}>
          {alert.message}
        </div>
      )}

      {reclamaciones.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Código de Reclamación</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
              <th>Validar Documentos</th> {/* Nueva columna para la validación */}
            </tr>
          </thead>
          <tbody>
            {reclamaciones.map((reclamacion) => (
              <tr key={reclamacion.reclamacionid}>
                <td>{`REC-${reclamacion.reclamacionid}`}</td>
                <td>{reclamacion.descripcion}</td>
                <td>{reclamacion.tipo}</td>
                <td>{reclamacion.estado}</td>
                <td>
                  {/* Botón para cambiar el estado */}
                  <button onClick={() => {
                    setReclamacionIdParaEstado(reclamacion.reclamacionid);
                    setEstadoSeleccionado(reclamacion.estado);
                  }} style={{ padding: '5px 10px', backgroundColor: '#FFB347', border: 'none', color: '#fff', cursor: 'pointer', marginRight: '10px' }}>
                    Cambiar Estado
                  </button>

                  {/* Mostrar dropdown de estados */}
                  {reclamacionIdParaEstado === reclamacion.reclamacionid && (
                    <div style={{ display: 'inline-block', marginRight: '10px' }}>
                      <select value={estadoSeleccionado} onChange={(e) => setEstadoSeleccionado(e.target.value)} style={{ padding: '5px' }}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Resuelta">Resuelta</option>
                        <option value="Rechazada">Rechazada</option>
                      </select>
                      <button onClick={() => handleActualizarEstado(reclamacion.reclamacionid, estadoSeleccionado)} style={{ padding: '5px 10px', backgroundColor: '#4CAF50', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        Actualizar
                      </button>
                    </div>
                  )}

                  {/* Botón para eliminar reclamación */}
                  <button onClick={() => handleEliminarReclamacion(reclamacion.reclamacionid)} style={{ padding: '5px 10px', backgroundColor: '#F44336', border: 'none', color: '#fff', cursor: 'pointer', marginRight: '10px' }}>
                    Eliminar
                  </button>
                </td>

                <td>
                  {/* Botón para validar documentos */}
                  <button onClick={() => handleValidarDocumentos(reclamacion.reclamacionid)} style={{ padding: '5px 10px', backgroundColor: '#2196F3', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    Validar Documentos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay reclamaciones disponibles.</p>
      )}
    </div>
  );
};

export default GestionarReclamaciones;
