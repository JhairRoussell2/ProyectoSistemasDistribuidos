import { useState } from 'react';

// ✅ Definir el tipo correcto de datos de registro
interface RegisterData {
  Nombre: string;
  Apellido: string;
  Email: string;
  Password: string;
  Rol: string;
}

interface RegisterFormProps {
  onSubmit: (userData: RegisterData) => void; // ✅ Cambiado de 'object' a 'RegisterData'
}

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    Nombre: '',
    Apellido: '',
    Email: '',
    Password: '',
    Rol: 'Personal',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // ✅ Ahora `onSubmit` recibe `RegisterData`, no un `object` genérico
  };

  return (
    <form onSubmit={handleSubmit} className="w-80 flex flex-col gap-4">
      <input name="Nombre" placeholder="Nombre" value={formData.Nombre} onChange={handleChange} className="p-2 border border-gray-600 rounded" required />
      <input name="Apellido" placeholder="Apellido" value={formData.Apellido} onChange={handleChange} className="p-2 border border-gray-600 rounded" required />
      <input name="Email" placeholder="Correo electrónico" value={formData.Email} onChange={handleChange} className="p-2 border border-gray-600 rounded" required />
      <input name="Password" type="password" placeholder="Contraseña" value={formData.Password} onChange={handleChange} className="p-2 border border-gray-600 rounded" required />
      <select name="Rol" value={formData.Rol} onChange={handleChange} className="p-2 border border-gray-600 rounded">
        <option value="Personal">Personal</option>
        <option value="Administrador">Administrador</option>
      </select>
      <button type="submit" className="bg-green-600 p-2 rounded hover:bg-green-800">
        Registrarse
      </button>
    </form>
  );
};

export default RegisterForm;
