import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "./Modal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full h-20 bg-gray-900 text-white shadow-lg px-6 flex justify-between items-center fixed top-0 z-50">
      {/* Logo */}
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
        <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
          Seguro<span className="text-red-300">Flex</span>
        </span>
      </h1>

      {/* Botón de Perfil */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold transition shadow-lg"
        >
          Ver Perfil
        </button>
      </div>

      {/* Modal de Perfil - Solo se muestra uno a la vez */}
      {showProfile && (
        <Modal onClose={() => setShowProfile(false)}>
          <div className="p-6 rounded-lg text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Perfil de Usuario</h2>
            <p className="text-gray-700 font-medium">
              <strong>Nombre:</strong> {user?.Nombre} {user?.Apellido}
            </p>
            <p className="text-gray-700 font-medium">
              <strong>Correo:</strong> {user?.Email}
            </p>
            <p className="text-gray-700 font-medium">
              <strong>Rol:</strong> {user?.Rol}
            </p>

            {/* Botón de Cerrar Sesión */}
            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Cerrar sesión
            </button>
          </div>
        </Modal>
      )}
    </nav>
  );
};

export default Navbar;
