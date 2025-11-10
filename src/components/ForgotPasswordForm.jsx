import React, { useState } from 'react';
import { Alert } from 'flowbite-react';
import apiClient from '../services/apiClient';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await apiClient.post(`/password-recovery/${email}`);
      setMessage(response.data.message);
    } catch (err) {
      setError('Ocurrió un error. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-2xl p-8">
        <h3 className="font-display font-bold text-2xl text-center text-vibe-dark-slate mb-4">Recuperar Contraseña</h3>
        {!message ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <p className="font-sans text-sm text-vibe-medium-gray text-center mb-2">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">Correo Electrónico</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5"/>
                </div>
                <button type="submit" className="w-full text-white !bg-vibe-coral hover:opacity-90 font-bold font-sans rounded-lg text-sm px-5 py-2.5 text-center">
                    Enviar Enlace de Recuperación
                </button>
            </form>
        ) : (
            <Alert color="success" className="font-sans">{message}</Alert>
        )}
        {error && <Alert color="failure" className="mt-4 font-sans">{error}</Alert>}
        <div className="text-center mt-4">
            <a href="/login" className="font-sans text-sm text-vibe-teal hover:underline">Volver a Iniciar Sesión</a>
        </div>
    </div>
  );
}
export default ForgotPasswordForm;