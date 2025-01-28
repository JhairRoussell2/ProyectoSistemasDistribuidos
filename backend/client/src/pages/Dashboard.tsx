import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.warn('No se encontró ningún usuario en localStorage. Redirigiendo a login.');
      navigate('/');
      return;
    }

    switch (user.Rol) {
      case 'Administrador':
        navigate('/dashboard/admin');
        break;
      case 'Personal':
        navigate('/dashboard/personal');
        break;
      default:
        navigate('/dashboard/general');
    }
  }, [user, navigate]);

  return <div className="text-center text-white">Redirigiendo...</div>;
};

export default Dashboard;
