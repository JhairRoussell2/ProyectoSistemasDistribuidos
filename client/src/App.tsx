import { Routes, Route } from "react-router-dom";
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
import ValidarPoliza from "./components/ValidarPoliza";
import RegistrarProveedor from "./pages/RegistrarProveedor";
import Proveedores from "./pages/Proveedores";
import EditarProveedor from "./pages/EditarProveedor";
import PaginaPrincipal from "./pages/PaginaPrincipal";



const App = () => {
  return (
    <AuthProvider>
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
        <Route path="/dashboard/personal/validar-poliza" element={<ValidarPoliza />} />
        <Route path="/polizas" element={<Policies />} />
        <Route path="/proveedores" element={<Proveedores/>} />
        <Route path="/registrar-proveedor" element={<RegistrarProveedor />} />
        <Route path="/editar-proveedor/:id" element={<EditarProveedor />} />
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


