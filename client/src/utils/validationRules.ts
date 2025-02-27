export const required = (value: string) => {
    return value ? null : 'Este campo es obligatorio.';
  };
  
  export const isEmail = (value: string) => {
    return /^\S+@\S+\.\S+$/.test(value) ? null : 'El correo electrónico no es válido.';
  };
  
  export const isPhoneNumber = (value: string) => {
    return /^9\d{8}$/.test(value) ? null : 'El teléfono debe tener 9 dígitos y comenzar con 9.';
  };
  
  export const isDNI = (value: string) => {
    return /^\d{8}$/.test(value) ? null : 'El DNI debe tener 8 dígitos.';
  };
  
  export const minLength = (min: number) => (value: string) => {
    return value.length >= min ? null : `Debe tener al menos ${min} caracteres.`;
  };
  
  export const isAlpha = (value: string) => {
    return /^[a-zA-Z\s]+$/.test(value) ? null : 'Solo debe contener letras y espacios.';
  };
  
  export const matches = (otherValue: string) => (value: string) => {
    return value === otherValue ? null : 'Las contraseñas no coinciden.';
  };

  export const isValidPlate = (value: string) => {
    return /^[A-Z]{3}-\d{3}$/.test(value) 
      ? null 
      : 'El formato debe ser ABC-123 (tres letras, guion, tres números).';
  };
  