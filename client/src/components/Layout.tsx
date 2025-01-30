import { ReactNode, useState } from "react";
import { FiFileText, FiDollarSign, FiBarChart2, FiShield, FiHome, FiInfo, FiClipboard, FiSettings } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Determina si estamos en el panel de administrador o general
  const isAdminPanel = location.pathname.startsWith("/dashboard/admin");
  const isGeneralPanel = location.pathname.startsWith("/dashboard/general");

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="flex flex-1">
        {/* Botón para colapsar el sidebar en móviles */}
        <button
          className="absolute top-16 left-4 bg-gray-800 p-2 rounded-lg md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-64" : "w-0"} bg-gray-800 p-6 transition-all duration-300`}>
          <nav className="space-y-4">
            {/* Enlace al Dashboard General */}
            <NavLink
              to="/dashboard/general"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <FiHome />
              <span>Panel General</span>
            </NavLink>

            {/* Opciones del menú para el Panel de Administrador */}
            {isAdminPanel && (
              <>
                <NavLink to="/registrar-proveedor" className="...">
                  <FiFileText /> Gestión de Proveedores
                </NavLink>
                <NavLink to="/dashboard/admin/pagos" className="...">
                  <FiDollarSign /> Pagos de Indemnización
                </NavLink>
                <NavLink to="/dashboard/admin/reportes" className="...">
                  <FiBarChart2 /> Generación de Reportes
                </NavLink>
                <NavLink to="/dashboard/admin/seguridad" className="...">
                  <FiShield /> Seguridad y Auditoría
                </NavLink>
              </>
            )}

            {/* Opciones específicas para el Panel General */}
            {isGeneralPanel && (
              <>
                <NavLink to="/dashboard/general/info" className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white">
                  <FiInfo />
                  <span>Ver Información</span>
                </NavLink>
                <NavLink to="/registro-siniestro" className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white">
                  <FiClipboard />
                  <span>Registrar Siniestro</span>
                </NavLink>
                <NavLink to="/dashboard/general/configuracion" className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white">
                  <FiSettings />
                  <span>Configurar Cuenta</span>
                </NavLink>
              </>
            )}
          </nav>
        </aside>

        {/* Contenido dinámico */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;