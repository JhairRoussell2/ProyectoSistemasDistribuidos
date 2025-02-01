import { useState } from 'react';
import apiClient from '../services/apiClient';

interface AuthResponse {
  token: string;
  user: {
    UsuarioID: number;
    Nombre: string;
    Apellido: string;
    Email: string;
  };
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);

  // Función de login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>('/api/beneficiarios/login', { Email: email, Password: password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      console.error('Error en inicio de sesión', error);
      throw new Error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  // Función de registro para crear un beneficiario
  const register = async (userData: { Nombre: string; Apellido: string; Email: string; Password: string; ConfirmPassword: string; Telefono: string; DNI: string }) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/beneficiarios', userData); // Cambié la ruta a '/api/beneficiarios'

      if (response.data && response.data.message) {
        alert(response.data.message); // Muestra mensaje del backend
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      } else {
        throw new Error('Error en el registro');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      alert('No se pudo registrar el usuario');
    } finally {
      setLoading(false);
    }
  };
  const createPolicy = async (BeneficiarioID: number, TipoPoliza: string) => {
    try {
      const response = await apiClient.post('/api/polizas', { BeneficiarioID, TipoPoliza });
      alert(`Póliza de tipo ${TipoPoliza} creada con éxito.`);
      return response.data;
    } catch (error) {
      console.error('Error al crear la póliza:', error);
      alert('No se pudo crear la póliza.');
    }
  }

  // Función para logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return { login, register, createPolicy ,logout, loading, user };
};
