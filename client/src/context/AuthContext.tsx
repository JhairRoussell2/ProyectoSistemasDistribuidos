import { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

interface AuthResponse {
  // token: string;
  user: { 
    UsuarioID: number; 
    Nombre: string; 
    Apellido: string; 
    Email: string;
    Telefono: string;  // Agregar Telefono
    DNI: string;  // Agregar DNI
  };
}

interface AuthContextType {
  user: { 
    UsuarioID: number; 
    Nombre: string; 
    Apellido: string; 
    Email: string;
    Telefono: string;
    DNI: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { 
    Nombre: string; 
    Apellido: string; 
    Email: string; 
    Password: string; 
    ConfirmPassword: string;
    Telefono: string;  // Agregar Telefono
    DNI: string;  // Agregar DNI
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  createPolicy: (BeneficiarioID: number, TipoPoliza: string) => Promise<any>;  // Add createPolicy here
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
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
      const response = await apiClient.post<AuthResponse>('/api/beneficiarios/login', { Email: email, Password: password });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error('Credenciales incorrectas');
    }
  };

  const register = async (userData: { 
    Nombre: string; 
    Apellido: string; 
    Email: string; 
    Password: string; 
    ConfirmPassword: string; 
    Telefono: string; 
    DNI: string; 
  }) => {
    try {
      const response = await apiClient.post<AuthResponse>('/api/beneficiarios', userData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error en registro:', error);
      throw new Error('No se pudo registrar el usuario');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Create a new policy function
  const createPolicy = async (BeneficiarioID: number, TipoPoliza: string) => {
    try {
      const response = await apiClient.post('/api/polizas', { BeneficiarioID, TipoPoliza });
      return response.data;
    } catch (error) {
      console.error('Error al crear la póliza:', error);
      alert('No se pudo crear la póliza.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, createPolicy }}>
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
