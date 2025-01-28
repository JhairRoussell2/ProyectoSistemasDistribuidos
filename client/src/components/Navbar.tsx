import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from './Modal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg p-4 flex justify-between items-center relative">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
          Seguro<span className="text-blue-400">Flex</span>
        </span>
      </h1>
      <div className="flex items-center space-x-4">
        {user?.Rol === 'Administrador' && (
          <button
            onClick={() => navigate('/usuarios')}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-semibold transition shadow-lg"
          >
            Ver Usuarios
          </button>
        )}
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-semibold transition shadow-lg"
        >
          Ver Perfil
        </button>
        {showProfile && (
          <Modal isOpen={showProfile} title="Perfil de Usuario" onClose={() => setShowProfile(false)}>
            <h2 className="text-xl font-bold text-white mb-2">Perfil de Usuario</h2>
            <p className="text-gray-300"><span className="font-bold">Nombre:</span> {user?.Nombre} {user?.Apellido}</p>
            <p className="text-gray-300"><span className="font-bold">Correo:</span> {user?.Email}</p>
            <p className="text-gray-300"><span className="font-bold">Rol:</span> {user?.Rol}</p>
            <button 
              onClick={handleLogout} 
              className="mt-4 w-full bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition"
            >
              Cerrar sesión
            </button>
          </Modal>
        )}
      </div>
    </nav>
  );
};

export default Navbar;