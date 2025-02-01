import { useState } from 'react';
import { Link } from 'react-router-dom';

interface RegisterData {
  nombre: string;  // Cambio de "Nombre" a "nombre"
  apellido: string;  // Cambio de "Apellido" a "apellido"
  email: string;
  telefono: string;
  dni: string;
  password: string;  // Cambio de "Password" a "password"
  confirmPassword: string;  // Cambio de "ConfirmPassword" a "confirmPassword"
}

interface RegisterFormProps {
  onSubmit: (userData: RegisterData) => void;
}

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    nombre: '',  // Cambio de "Nombre" a "nombre"
    apellido: '',  // Cambio de "Apellido" a "apellido"
    email: '',
    telefono: '',
    dni: '',
    password: '',  // Cambio de "Password" a "password"
    confirmPassword: '',  // Cambio de "ConfirmPassword" a "confirmPassword"
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
      setMessage("Hubo un error en el registro. Por favor, inténtalo de nuevo."); // Mensaje de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-96 space-y-6">
        <h2 className="text-3xl font-semibold text-center text-red-500">Crear Cuenta</h2>

        {message && (
          <div className={`text-center p-2 rounded-lg ${message.includes("error") ? 'bg-red-500' : 'bg-green-500'} text-white`}>
            {message}
          </div>
        )}

        {/* Campos de entrada */}
        <div>
          <input
            name="nombre"  // Asegúrate de usar 'nombre' en minúsculas
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="apellido"  // Asegúrate de usar 'apellido' en minúsculas
            type="text"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="email"
            type="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="telefono"
            type="text"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="dni"
            type="text"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="password"  // Asegúrate de usar 'password' en minúsculas
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="confirmPassword"  // Asegúrate de usar 'confirmPassword' en minúsculas
            type="password"
            placeholder="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 p-3 rounded-lg text-white font-semibold hover:bg-red-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>

        <div className="text-center">
          <p className="text-gray-600">¿Ya tienes cuenta? <Link to="/login" className="text-red-600 hover:text-red-800">Inicia sesión</Link></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
