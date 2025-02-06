import React, { useState } from 'react';

interface ValidationProps {
  value: string;
  rules: ((value: string) => string | null)[];
  children: (error: string | null) => React.ReactNode;
}

const Validation: React.FC<ValidationProps> = ({ value, rules, children }) => {
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    for (const rule of rules) {
      const errorMessage = rule(value);
      if (errorMessage) {
        setError(errorMessage);
        return;
      }
    }
    setError(null);
  };

  React.useEffect(() => {
    validate();
  }, [value]);

  return <>{children(error)}</>;
};

export default Validation;