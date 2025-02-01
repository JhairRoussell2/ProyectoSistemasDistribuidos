import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.jpg"; // Asegúrate de incluir tu logo

const Login = () => {
  const { login } = useAuth();  // Contexto de autenticación
  const navigate = useNavigate(); // Navegación entre rutas
  const [email, setEmail] = useState(''); // Estado para el correo
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [error, setError] = useState(''); // Estado para mensajes de error
  const [loading, setLoading] = useState(false); // Estado de carga

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir recarga de página
    setLoading(true); // Inicia el estado de carga

    try {
      await login(email, password); // Intenta iniciar sesión
      navigate('/dashboard'); // Redirige a dashboard si el login es exitoso
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.'); // Muestra mensaje de error
      console.error('Error en inicio de sesión:', err);
    } finally {
      setLoading(false); // Detén el estado de carga
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-lg w-full max-w-md text-center border border-gray-700">
        {/* Logo centrado */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="SegurosFlex" className="w-24 mb-3" />
          <h1 className="text-4xl font-extrabold text-red-500">SegurosFlex</h1>
          <p className="text-gray-400">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Campo de email */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-4 text-gray-500" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          {/* Campo de contraseña */}
          <div className="relative">
            <FaLock className="absolute left-4 top-4 text-gray-500" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          {/* Mensaje de error */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Enlaces de ayuda */}
          <div className="flex justify-between text-sm text-gray-400">
            <Link to="/recuperar" className="text-red-400 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/register" className="text-blue-400 hover:underline">
              Regístrate aquí
            </Link>
          </div>

          {/* Botón de inicio de sesión */}
          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-lg transition-all duration-300"
            disabled={loading} // Deshabilitar botón si está cargando
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>

      {/* Botón de WhatsApp flotante */}
      <a
        href="https://wa.me/123456789"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp className="text-3xl" />
        <span className="font-semibold">WhatsApp</span>
      </a>
    </div>
  );
};

export default Login;
