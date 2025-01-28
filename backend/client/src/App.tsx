import { Routes, Route } from "react-router-dom";
import RegistroSiniestro from "./components/RegistroSiniestro";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PersonalDashboard from "./pages/PersonalDashboard";
import GeneralDashboard from "./pages/GeneralDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/personal" element={<PersonalDashboard />} />
        <Route path="/dashboard/general" element={<GeneralDashboard />} />
        <Route path="/registro-siniestro" element={<RegistroSiniestro />} />
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