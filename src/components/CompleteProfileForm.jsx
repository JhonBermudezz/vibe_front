import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

function CompleteProfileForm() {
  const { user, refreshUser, getAccessToken } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    dateOfBirth: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = getAccessToken();
      if (!token) {
        setError("No estás autenticado. Por favor, inicia sesión de nuevo.");
        return;
      }
      
      const payload = {
        username: formData.username,
        date_of_birth: formData.dateOfBirth,
      };

      await apiClient.patch(
        '/users/me/profile',
        payload,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      await refreshUser();
      
    } catch (err) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (err.response) {
        errorMessage = err.response.data.detail || JSON.stringify(err.response.data);
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor. ¿Está funcionando el backend?';
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6">
      <h3 className="font-display font-semibold text-2xl text-center text-vibe-dark-slate">
        ¡Casi listo! Completa tu perfil
      </h3>
      <p className="text-center font-sans text-sm text-vibe-medium-gray mt-2 mb-6">
        Elige un nombre de usuario único para continuar.
      </p>
      <form className="flex flex-col gap-4 text-left" onSubmit={handleSubmit}>
        {error && (
            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                {error}
            </div>
        )}
        <div>
          <label htmlFor="username" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">
            Nombre de Usuario
          </label>
          <input 
            id="username"
            type="text"
            required
            onChange={handleChange}
            value={formData.username}
            className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5"
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">
            Fecha de Nacimiento
          </label>
          <input 
            id="dateOfBirth"
            type="date"
            required
            onChange={handleChange}
            className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5"
          />
        </div>
        <button 
            type="submit"
            className="w-full text-white !bg-vibe-coral hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold font-sans rounded-lg text-sm px-5 py-2.5 text-center mt-2"
        >
          Guardar y Continuar
        </button>
      </form>
    </div>
  );
}

export default CompleteProfileForm;