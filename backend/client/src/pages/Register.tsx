import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (userData: object) => {
    try {
      await register(userData);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
