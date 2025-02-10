import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Alert from '../components/AlertCard';

interface CheckoutFormProps {
  policy: string;
  clientSecret: string;
  onSuccess: (policy: string) => Promise<void>;  // Añadimos la propiedad onSuccess
}

const CheckoutForm = ({ policy, clientSecret, onSuccess }: CheckoutFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe no está cargado correctamente.');
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('No se pudo obtener el elemento de la tarjeta');
      setProcessing(false);
      return;
    }

    const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (paymentError) {
      setError(paymentError.message || 'Hubo un error con el pago');
      setProcessing(false);
      return;
    }

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message || 'Hubo un error al confirmar el pago');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Llamamos a onSuccess solo después de un pago exitoso
        await onSuccess(policy);
      } else {
        setError('Hubo un error al procesar el pago');
      }
    } catch (networkError) {
      setError('Error de red al procesar el pago');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Detalles de Pago</h3>
      <div className="mb-4">
        <CardElement className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
      {successMessage && <Alert message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />}
      <button
        type="submit"
        disabled={processing}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-400"
      >
        {processing ? 'Procesando...' : `Pagar por Póliza ${policy}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
