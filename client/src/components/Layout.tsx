import { ReactNode } from 'react';
import { FiFileText, FiDollarSign, FiBarChart2, FiShield } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 p-6">
          <nav className="space-y-4">
            <NavLink
              to="/dashboard/admin"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <FiFileText />
              <span>Gestión de Presupuestos</span>
            </NavLink>
            <NavLink
              to="/dashboard/admin/pagos"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <FiDollarSign />
              <span>Pagos de Indemnización</span>
            </NavLink>
            <NavLink
              to="/dashboard/admin/reportes"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <FiBarChart2 />
              <span>Generación de Reportes</span>
            </NavLink>
            <NavLink
              to="/dashboard/admin/seguridad"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <FiShield />
              <span>Seguridad y Auditoría</span>
            </NavLink>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;