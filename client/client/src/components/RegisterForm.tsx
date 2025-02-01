import { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link para redirigir al login

// Definir el tipo correcto de datos de registro
interface RegisterData {
  Nombre: string;
  Apellido: string;
  Email: string;
  Telefono: string; // Campo Telefono
  DNI: string; // Campo DNI
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
    Telefono: '', // Iniciamos con vacío
    DNI: '', // Iniciamos con vacío
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
    <div className="flex justify-center items-center min-h-screen bg-blend-darken-100">
      <form
        onSubmit={handleSubmit}
        className="bg-amber-700 p-8 rounded-lg shadow-lg w-96 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-700">Crear Cuenta</h2>
        
        {message && (
          <div className={`text-center p-2 rounded-lg ${message.includes("error") ? 'bg-red-500' : 'bg-green-500'} text-white`}>
            {message}
          </div>
        )}
        
        <input
          name="Nombre"
          type="text"
          placeholder="Nombre"
          value={formData.Nombre}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <input
          name="Apellido"
          type="text"
          placeholder="Apellido"
          value={formData.Apellido}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <input
          name="Email"
          type="email"
          placeholder="Correo Electrónico"
          value={formData.Email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <input
          name="Telefono"
          type="text"
          placeholder="Teléfono"
          value={formData.Telefono}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <input
          name="DNI"
          type="text"
          placeholder="DNI"
          value={formData.DNI}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          name="Password"
          type="password"
          placeholder="Contraseña"
          value={formData.Password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <input
          name="ConfirmPassword"
          type="password"
          placeholder="Confirmar Contraseña"
          value={formData.ConfirmPassword}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 p-3 rounded-lg text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>

        {/* Link para redirigir al login */}
        <div className="text-center">
          <p className="text-gray-600">¿Ya tienes cuenta? <Link to="/" className="text-blue-600 hover:text-blue-800">Inicia sesión</Link></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
