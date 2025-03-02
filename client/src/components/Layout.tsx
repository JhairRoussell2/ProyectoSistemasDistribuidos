import { ReactNode, useState } from "react";
import {
  FiFileText,
  FiDollarSign,
  FiBarChart2,
  FiHome,
  FiClipboard,
  FiCheckCircle,
  FiUsers,
  FiMapPin, // Icono de seguimiento añadido
} from "react-icons/fi";

import { NavLink, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Determina si estamos en el panel de administrador, general o personal
  const isAdminPanel = location.pathname.startsWith("/dashboard/admin");
  const isGeneralPanel = location.pathname.startsWith("/dashboard/general");
  const isPersonalPanel = location.pathname.startsWith("/dashboard/personal");

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />

      <div className="flex flex-1 mt-16">
        {" "}
        {/* Add margin-top to avoid navbar collision */}
        {/* Botón para colapsar el sidebar en móviles */}
        <button
          className="absolute top-16 left-4 bg-gray-800 p-2 rounded-lg md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } bg-gray-800 p-6 transition-all duration-300`}
        >
          <nav className="space-y-4">
            {/* Opciones del menú para el Panel de Administrador */}
            {isAdminPanel && (
              <>
                <NavLink
                  to="/dashboard/admin"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <FiHome />
                  <span>Panel General</span>
                </NavLink>
                <NavLink
                  to="/proveedores"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiFileText />
                  <span>Gestión de Proveedores</span>
                </NavLink>
                <NavLink
                  to="/talleres"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiFileText />
                  <span>Gestión de Talleres</span>
                </NavLink>
                <NavLink
                  to="/gestionarpresupuestos"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiDollarSign />
                  <span>Gestionar Presupuestos</span>
                </NavLink>
                <NavLink
                  to="/dashboard/admin/pagos"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiDollarSign />
                  <span>Pagos de Indemnización</span>
                </NavLink>
                <NavLink
                  to="/dashboard/admin/GenerarReporte"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiBarChart2 />
                  <span>Generación de Reportes</span>
                </NavLink>
                
              </>
            )}

            {/* Opciones específicas para el Panel General */}
            {isGeneralPanel && (
              <>
                <NavLink
                  to="/dashboard/general"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <FiHome />
                  <span>Panel General</span>
                </NavLink>
                <NavLink
                  to="/registro-siniestro"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiClipboard />
                  <span>Registrar Siniestro</span>
                </NavLink>
                <NavLink
                  to="/registrar-reclamacion"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiFileText />
                  <span>Registrar Reclamación</span>
                </NavLink>
                <NavLink
                  to="/seguimiento"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiMapPin  />
                  <span>Gestionar Seguimiento</span>
                </NavLink>
              </>
            )}

            {/* Opciones específicas para el Panel de Personal */}
            {isPersonalPanel && (
              <>
                <NavLink
                  to="/dashboard/personal"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <FiHome />
                  <span>Panel General</span>
                </NavLink>
                <NavLink
                  to="/dashboard/personal/validar-poliza"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiCheckCircle />
                  <span>Validar Polizas</span>
                </NavLink>
                <NavLink
                  to="/dashboard/personal/Mantener-Beneficiario"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiUsers />
                  <span>Gestión de Beneficiarios</span>
                </NavLink>
                <NavLink
                  to="/dashboard/personal/asignar-siniestros"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiClipboard />
                  <span>Asignar Taller a Siniestro</span>
                </NavLink>
                <NavLink
                  to="/dashboard/personal/gestionar-reclamaciones"
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FiClipboard />
                  <span>Gestionar Reclamaciones</span>
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
