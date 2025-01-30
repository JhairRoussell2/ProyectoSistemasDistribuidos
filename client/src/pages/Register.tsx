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
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (userData: RegisterData) => {
    try {
      await register(userData);
      alert("Registro exitoso");
      navigate('/login'); // Redirigir al usuario después del registro
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("No se pudo registrar el usuario.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
