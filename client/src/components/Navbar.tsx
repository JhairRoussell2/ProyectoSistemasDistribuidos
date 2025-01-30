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
        {/*user?.Rol === 'Administrador' && (
          <button
            onClick={() => navigate('/usuarios')}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-semibold transition shadow-lg"
          >
            Ver Usuarios
          </button>
        )*/}
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-semibold transition shadow-lg"
        >
          Ver Perfil
        </button>
        {showProfile && (
         <Modal onClose={() => setShowProfile(false)}>
         <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
           {/* Botón de Cerrar */}
           <button 
             onClick={() => setShowProfile(false)}
             className="absolute top-4 right-4 bg-black text-red-500 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500 hover:text-white transition"
           >
             ✖
           </button>
       
           {/* Información del Usuario */}
           <h2 className="text-2xl font-bold text-red-600 mb-4">Perfil de Usuario</h2>
           <p className="text-gray-700 font-medium">Nombre: <span className="font-normal">{user?.Nombre} {user?.Apellido}</span></p>
           <p className="text-gray-700 font-medium">Correo: <span className="font-normal">{user?.Email}</span></p>
           <p className="text-gray-700 font-medium">Rol: <span className="font-normal">{user?.Rol}</span></p>
       
           {/* Botón de Cerrar Sesión */}
           <button 
             onClick={handleLogout} 
             className="mt-6 w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
           >
             Cerrar sesión
           </button>
         </div>
       </Modal>
        )}
      </div>
    </nav>
  );
};

export default Navbar;