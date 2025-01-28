import { useState } from 'react';

interface RegisterFormProps {
  onSubmit: (userData: object) => void;
}

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-80 flex flex-col gap-4">
      <input name="Nombre" placeholder="Nombre" onChange={handleChange} className="p-2 border border-gray-600 rounded" required />
      <input name="Apellido" placeholder="Apellido" onChange={handleChange} className="p-2 border border-gray-600 rounded" required />
      <input name="Email" placeholder="Correo electrónico" onChange={handleChange} className="p-2 border border-gray-600 rounded" required />
      <input name="Password" type="password" placeholder="Contraseña" onChange={handleChange} className="p-2 border border-gray-600 rounded" required />
      <select name="Rol" onChange={handleChange} className="p-2 border border-gray-600 rounded">
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
