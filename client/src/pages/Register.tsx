import { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext'; // Para obtener el contexto de autenticación
import { useNavigate } from 'react-router-dom';

interface RegisterData {
  Nombre: string;
  Apellido: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  Telefono: string;
  DNI: string;
}

const Register = () => {
  const { register } = useAuth(); // Función de registro del contexto
  const navigate = useNavigate(); // Navegación entre rutas
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async (userData: RegisterData) => {
    try {
      await register(userData); // Enviar datos al contexto de autenticación para el registro
      setSuccess(true);
      setTimeout(() => {
        navigate('/login'); // Redirige al usuario a la página de login después de 3 segundos
      }, 3000);
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("No se pudo registrar el usuario. Intenta nuevamente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {success ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-green-500 mb-4">¡Registro Exitoso!</h2>
          <p className="text-gray-700">Serás redirigido a la página de inicio de sesión en breve.</p>
        </div>
      ) : (
        <RegisterForm onSubmit={handleRegister} />
      )}
    </div>
  );
};

export default Register;