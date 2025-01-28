import { useState } from 'react';
import apiClient from '../services/apiClient';

interface AuthResponse {
  token: string;
  user: {
    UsuarioID: number;
    Nombre: string;
    Apellido: string;
    Email: string;
    Rol: 'Personal' | 'Administrador' | 'General';
  };
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>('/login', { Email: email, Password: password });
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return { login, logout, loading, user };
};
