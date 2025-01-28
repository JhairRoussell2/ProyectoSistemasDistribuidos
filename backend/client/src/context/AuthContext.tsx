import { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

interface AuthResponse {
  token: string;
  user: { UsuarioID: number; Nombre: string; Apellido: string; Email: string; Rol: 'Personal' | 'Administrador' | 'General' };
}

interface AuthContextType {
  user: { UsuarioID: number; Nombre: string; Apellido: string; Email: string; Rol: 'Personal' | 'Administrador' | 'General' } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    const storedUser = localStorage.getItem('user');
    console.log('Usuario:', storedUser);
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al analizar los datos de usuario:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<AuthResponse>('/login', { Email: email, Password: password });

      if (!response.data || !response.data.user) {
        throw new Error('Respuesta inválida del servidor');
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error('Credenciales incorrectas');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};