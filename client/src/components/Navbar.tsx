import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import apiClient from '../services/apiClient';
import { FaBell } from 'react-icons/fa'; // Import Bell icon from react-icons

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showCard, setShowCard] = useState(false); // State to manage the card visibility
  const [isNewBeneficiario, setIsNewBeneficiario] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Función para verificar si el beneficiario es nuevo
  const checkIfNewBeneficiario = async () => {
    try {
      if (user?.UsuarioID) {
        const response = await apiClient.get(`/api/beneficiarios/${user?.UsuarioID}/check-new`);
        setIsNewBeneficiario(response.data.isNew);
      }
    } catch (error) {
      console.error("Error al obtener si es nuevo el beneficiario:", error);
    }
  };

  // Función para obtener el rol del usuario
  const fetchUserRole = async () => {
    try {
      const response = await apiClient.get(`/api/beneficiarios/user/${user?.UsuarioID}/role`);
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
    }
  };

  useEffect(() => {
    if (user) {
      checkIfNewBeneficiario();
      fetchUserRole(); // Llamamos a la función para obtener el rol
    }
  }, [user]);

  const handleContinue = () => {
    // Redirigir a la página de elección de póliza
    navigate('/polizas');
    setShowCard(false); // Cerrar la tarjeta
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
        {userRole === 'Administrador' && (
          <button
            onClick={() => navigate('/usuarios')}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-semibold transition shadow-lg"
          >
            Ver Usuarios
          </button>
        )}
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold transition shadow-lg"
        >
          Ver Perfil
        </button>

        {/* Bell Icon for notifications */}
        {userRole === 'Beneficiario' && isNewBeneficiario !== null && (
          <div className="relative">
            <button
              onClick={() => setShowCard(!showCard)} // Toggle card visibility when clicking on notification icon
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-semibold transition shadow-lg"
            >
              <FaBell className="w-6 h-6" />
            </button>
            {isNewBeneficiario ? (
              <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                1
              </span>
            ) : (
              <span className="absolute top-0 right-0 bg-gray-400 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                0
              </span>
            )}
          </div>
        )}

        {/* Card for new beneficiary notification */}
        {showCard && isNewBeneficiario && (
          <div className="absolute top-16 right-0 bg-white text-black rounded-lg shadow-xl w-80 p-4">
            <h3 className="text-lg font-bold mb-2">¿Aún no tienes tu póliza?</h3>
            <p className="text-sm mb-4">Elígela ahora mismo y obtén todos los beneficios.</p>
            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold transition"
            >
              Continuar
            </button>
          </div>
        )}

        {showProfile && (
        <Modal onClose={() => setShowProfile(false)}>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-96 max-w-full">
          {/* ✅ Título con nueva fuente e ícono */}
          <h2
            className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2 text-center uppercase tracking-wide flex items-center justify-center gap-3"
            style={{ fontFamily: "'Playfair Display', serif" }} // 📌 Aplicar la fuente aquí
          >
            <i className="fas fa-user-circle text-red-600 text-2xl"></i> {/* 📌 Ícono de usuario */}
            Perfil de Usuario
          </h2>
      
          {/* ✅ Información del usuario */}
          <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-300 space-y-3">
            <p className="text-gray-700 text-[16px] leading-7">
              <span className="font-semibold text-red-700">Nombre:</span> {user?.Nombre} {user?.Apellido}
            </p>
            <p className="text-gray-700 text-[16px] leading-7">
              <span className="font-semibold text-red-700">Correo:</span> {user?.Email}
            </p>
            <p className="text-gray-700 text-[16px] leading-7">
              <span className="font-semibold text-red-700">Rol:</span> {userRole}
            </p>
          </div>
      
          {/* ✅ Botón refinado */}
          <button 
            onClick={handleLogout} 
            className="mt-6 w-full bg-gray-900 hover:bg-gray-700 px-4 py-3 rounded-lg text-white font-medium tracking-wide transition duration-300 shadow-md"
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