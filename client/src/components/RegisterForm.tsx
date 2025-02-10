import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Mail, Phone, Lock, CheckCircle, IdCard } from "lucide-react"; // Íconos
import Validation from './Validation';
import { required, isEmail, isPhoneNumber, isDNI, minLength, isAlpha, matches } from '../utils/validationRules';

interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (userData: RegisterData) => void;
}

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    dni: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null); // Mensaje de estado (error o éxito)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await onSubmit(formData);
      setMessage("¡Registro exitoso!"); // Mensaje de éxito
    } catch (error) {
      console.error('Error al registrar:', error);
      if ((error as any).response && (error as any).response.data && (error as any).response.data.error) {
        const errorMessage = (error as any).response?.data?.error || 'Hubo un error en el registro. Por favor, inténtalo de nuevo.';
        toast.error(errorMessage);
      } else {
        toast.error('Hubo un error en el registro. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-red-100 via-red-200 to-red-300 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg border border-red-300">
        <h2 className="text-4xl font-bold text-center text-red-700 mb-4">🔐 Crear Cuenta</h2>
        <p className="text-gray-600 text-center mb-6">Completa los datos para registrarte.</p>

        {message && (
          <div className={`text-center p-2 rounded-lg ${message.includes("error") ? 'bg-red-500' : 'bg-green-500'} text-white`}>
            {message}
          </div>
        )}

        {/* Campos de entrada */}
        <div>
          <label className="block text-gray-700 font-semibold">Nombre</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <Validation value={formData.nombre} rules={[required, isAlpha]}>
              {(error) => (
                <>
                  <input
                    name="nombre"
                    type="text"
                    placeholder="Tu Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full pl-10 p-3 rounded-md border ${error ? 'border-red-500' : 'border-red-300'} bg-red-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400`}
                    required
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </>
              )}
            </Validation>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Apellido</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <Validation value={formData.apellido} rules={[required, isAlpha]}>
              {(error) => (
                <>
                  <input
                    name="apellido"
                    type="text"
                    placeholder="Tu Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={`w-full pl-10 p-3 rounded-md border ${error ? 'border-red-500' : 'border-red-300'} bg-red-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400`}
                    required
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </>
              )}
            </Validation>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Correo Electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <Validation value={formData.email} rules={[required, isEmail]}>
              {(error) => (
                <>
                  <input
                    name="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 p-3 rounded-md border ${error ? 'border-red-500' : 'border-red-300'} bg-red-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400`}
                    required
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </>
              )}
            </Validation>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" />
            <Validation value={formData.telefono} rules={[required, isPhoneNumber]}>
              {(error) => (
                <>
                  <input
                    name="telefono"
                    type="text"
                    placeholder="+51 987 654 321"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`w-full pl-10 p-3 rounded-md border ${error ? 'border-red-500' : 'border-red-300'} bg-red-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400`}
                    required
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </>
              )}
            </Validation>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">DNI</label>
          <div className="relative">
            <IdCard className="absolute left-3 top-3 text-gray-400" />
            <Validation value={formData.dni} rules={[required, isDNI]}>
              {(error) => (
                <>
                  <input
                    name="dni"
                    type="text"
                    placeholder="12345678"
                    value={formData.dni}
                    onChange={handleChange}
                    className={`w-full pl-10 p-3 rounded-md border ${error ? 'border-red-500' : 'border-red-300'} bg-red-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400`}
                    required
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </>
              )}
            </Validation>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <Validation value={formData.password} rules={[required, minLength(6)]}>
              {(error) => (
                <>
                  <input
                    name="password"
                    type="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 p-3 rounded-md border ${error ? 'border-red-500' : 'border-red-300'} bg-red-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400`}
                    required
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </>
              )}
            </Validation>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Confirmar Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <Validation value={formData.confirmPassword} rules={[required, matches(formData.password)]}>
              {(error) => (
                <>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 p-3 rounded-md border ${error ? 'border-red-500' : 'border-red-300'} bg-red-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400`}
                    required
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </>
              )}
            </Validation>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 p-3 rounded-md text-white font-semibold hover:bg-red-600 transition duration-300 flex items-center justify-center gap-2 mt-3"
          disabled={loading}
        >
          <CheckCircle size={18} />
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-semibold text-red-600 hover:text-red-800 transition">
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;