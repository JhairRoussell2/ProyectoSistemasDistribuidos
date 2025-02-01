import { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link para redirigir al login

// Definir el tipo correcto de datos de registro
interface RegisterData {
  Nombre: string;
  Apellido: string;
  Email: string;
  Telefono: string;
  DNI: string;
  Password: string;
  ConfirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (userData: RegisterData) => void;
}

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    Nombre: '',
    Apellido: '',
    Email: '',
    Telefono: '',
    DNI: '',
    Password: '',
    ConfirmPassword: '',
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
      // Simula el envío de datos
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
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-96 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-red-500">Crear Cuenta</h2>
        
        {message && (
          <div className={`text-center p-2 rounded-lg ${message.includes("error") ? 'bg-red-500' : 'bg-green-500'} text-white`}>
            {message}
          </div>
        )}
        
        {/* Campos de entrada */}
        <div>
          <input
            name="Nombre"
            type="text"
            placeholder="Nombre"
            value={formData.Nombre}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="Apellido"
            type="text"
            placeholder="Apellido"
            value={formData.Apellido}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="Email"
            type="email"
            placeholder="Correo Electrónico"
            value={formData.Email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="Telefono"
            type="text"
            placeholder="Teléfono"
            value={formData.Telefono}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="DNI"
            type="text"
            placeholder="DNI"
            value={formData.DNI}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="Password"
            type="password"
            placeholder="Contraseña"
            value={formData.Password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <input
            name="ConfirmPassword"
            type="password"
            placeholder="Confirmar Contraseña"
            value={formData.ConfirmPassword}
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

        {/* Link para redirigir al login */}
        <div className="text-center">
          <p className="text-gray-600">¿Ya tienes cuenta? <Link to="/login" className="text-red-600 hover:text-red-800">Inicia sesión</Link></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
