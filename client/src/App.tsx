import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; // Importamos el ToastContainer
import RegistroSiniestro from "./pages/RegistrarSiniestro";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Policies from "./pages/Policies";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PersonalDashboard from "./pages/PersonalDashboard";
import GeneralDashboard from "./pages/GeneralDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import MantenerBeneficiarios from "./pages/Beneficiarios";
import ValidarPolizas from "./pages/ValdidarPolizas";
import RegistrarProveedor from "./pages/RegistrarProveedor";
import Proveedores from "./pages/Proveedores";
import EditarProveedor from "./pages/EditarProveedor";
import RegistrarTaller from "./pages/RegistrarTaller";
import Talleres from "./pages/Talleres";
import EditarTaller from "./pages/EditarTalleres";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import RegistrarReclamacion from "./pages/RegistrarReclamacion"; // ✅ Importa la página
import GestionarReclamaciones from "./pages/GestionReclamaciones"; // Importa la página de gestionar reclamaciones

import GestionarPresupuestos from "./pages/Presupuestos"; // Importa la página
import DetallePresupuestos from "./pages/GestionarPresupuestos";
import ForgotPassword from "./pages/Recuperar";
import ResetPassword from "./pages/Resetear";
import AsignarTaller from "./pages/AsignarTaller";
import BeneficiarioPerfil from "./pages/BeneficiarioPerfil";

import SeguimientoSiniestros from "./pages/Seguimiento";
// No olvides importar los estilos de react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa el CSS de react-toastify
import DetallesReclamacion from "./pages/DetallesReclamacion";
import SeguimientoDetalle from "./pages/SeguimientoDetalle";

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer /> {/* Colocamos el ToastContainer aquí para que las notificaciones se muestren */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/personal" element={<PersonalDashboard />} />
        <Route path="/dashboard/general" element={<GeneralDashboard />} />
        <Route path="/registro-siniestro" element={<RegistroSiniestro />} />
        <Route path="/dashboard/personal/Mantener-Beneficiario" element={<MantenerBeneficiarios />} />
        <Route path="/dashboard/personal/validar-poliza" element={<ValidarPolizas />} />
        <Route path="/dashboard/personal/asignar-siniestros" element={<AsignarTaller />} /> 
        <Route path="/dashboard/general/polizas" element={<Policies />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/gestionarpresupuestos" element={<GestionarPresupuestos />} />
        <Route path="/detallepresupuesto/:id" element={<DetallePresupuestos />} />
        <Route path="/registrar-proveedor" element={<RegistrarProveedor />} />
        <Route path="/editar-proveedor/:id" element={<EditarProveedor />} />
        <Route path="/talleres" element={<Talleres />} />
        <Route path="/registrar-taller" element={<RegistrarTaller />} />
        <Route path="/editar-taller/:id" element={<EditarTaller />} />
        <Route path="/registrar-reclamacion" element={<RegistrarReclamacion />} />
        <Route path="/dashboard/general/info" element={<BeneficiarioPerfil />} />
        <Route path="/recuperar" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/dashboard/personal/gestionar-reclamaciones" element={<GestionarReclamaciones />} /> {/* Aquí agregas la nueva ruta */}
        <Route path="/detalles-reclamacion/:id" element={<DetallesReclamacion />} />  {/* Ruta para Validar Documentos */}
        <Route path="/seguimiento" element={<SeguimientoSiniestros />} />
        <Route path="/seguimiento-detalle/:siniestroid" element={<SeguimientoDetalle />} />

        
               
        {/* Rutas protegidas */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/personal" element={<PersonalDashboard />} />
          <Route path="/dashboard/general" element={<GeneralDashboard />} />
          <Route path="/registro-siniestro" element={<RegistroSiniestro />} />
        </Route> */}
      </Routes>
    </AuthProvider>
  );
};

export default App;