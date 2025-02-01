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

  const handleRegister = async (userData: RegisterData) => {
    try {
      await register(userData); // Enviar datos al contexto de autenticación para el registro
      alert("Registro exitoso");
      navigate('/login'); // Redirige al usuario a la página de login después del registro exitoso
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("No se pudo registrar el usuario. Intenta nuevamente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Pasa la función handleRegister como prop al formulario */}
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
