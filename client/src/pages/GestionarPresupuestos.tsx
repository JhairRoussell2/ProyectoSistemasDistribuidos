import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, DollarSign } from "lucide-react";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";

const API_PRESUPUESTO_URL = "http://localhost:5002/api/presupuesto-pagos";

const GestionarPresupuesto = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Se mueve dentro del componente
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [form, setForm] = useState({
    detalles: "",
    costoPiezas: 0,
    costoReparacion: 0,
    impuestos: 0,
    montoTotal: 0,
  });

  const calcularTotales = (costoPiezas: number, costoReparacion: number) => {
    const subtotal = costoPiezas + costoReparacion;
    const impuestos = subtotal * 0.18;
    const montoTotal = subtotal + impuestos;
    setForm((prev) => ({ ...prev, impuestos, montoTotal }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value) || 0;
    setForm((prev) => {
      const updatedForm = { ...prev, [name]: name === "detalles" ? value : parsedValue };
      if (name === "costoPiezas" || name === "costoReparacion") {
        calcularTotales(updatedForm.costoPiezas, updatedForm.costoReparacion);
      }
      return updatedForm;
    });
  };

  const handleValidate = async () => {
    try {
      const payload = {
        montototal: parseFloat(form.montoTotal.toFixed(2)),
        costo_reparacion: parseFloat(form.costoReparacion.toFixed(2)),
        costo_piezas_mano_obra: parseFloat(form.costoPiezas.toFixed(2)),
        detalle_presupuesto: form.detalles,
        estado: "Validado",
        fechacreacion: new Date().toISOString(),
      };
  
      await axios.put(`${API_PRESUPUESTO_URL}/${id}`, payload);
      setAlert({ type: "success", message: "Presupuesto validado correctamente" });
  
      // Redirigir a /gestionarpresupuestos después de un breve tiempo
      setTimeout(() => navigate("/gestionarpresupuestos"), 1500);
    } catch (error) {
      setAlert({ type: "error", message: "Error al validar el presupuesto" });
      console.error("Error al validar el presupuesto:", error);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleValidate();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-100 via-red-200 to-red-300 text-gray-900 pt-24">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl border border-red-300">
          <h1 className="text-4xl font-bold text-red-700 text-center mb-4 flex items-center justify-center gap-2">
            <DollarSign className="text-gray-500" /> Gestionar Presupuesto - Siniestro {id}
          </h1>
          <p className="text-gray-600 text-center mb-6">Completa los datos para gestionar el presupuesto.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Detalles del Presupuesto</label>
              <textarea
                name="detalles"
                placeholder="Ingrese los detalles del presupuesto..."
                value={form.detalles}
                onChange={handleChange}
                className="w-full p-3 border rounded-md bg-red-50"
                rows={3}
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Costo de Piezas y Mano de Obra</label>
              <input
                type="number"
                name="costoPiezas"
                value={form.costoPiezas}
                onChange={handleChange}
                className="w-full p-3 border rounded-md bg-red-50"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Costo de Reparación</label>
              <input
                type="number"
                name="costoReparacion"
                value={form.costoReparacion}
                onChange={handleChange}
                className="w-full p-3 border rounded-md bg-red-50"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Impuestos (18%)</label>
              <input
                type="number"
                name="impuestos"
                value={form.impuestos.toFixed(2)}
                className="w-full p-3 border rounded-md bg-gray-200"
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Monto Total</label>
              <input
                type="number"
                name="montoTotal"
                value={form.montoTotal.toFixed(2)}
                className="w-full p-3 border rounded-md bg-gray-200"
                readOnly
              />
            </div>

            <button
              type="submit"
              className="col-span-2 bg-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} /> Validar Presupuesto
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default GestionarPresupuesto;
