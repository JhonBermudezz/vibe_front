import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formBody = new URLSearchParams();
    formBody.append('username', formData.username);
    formBody.append('password', formData.password);
    try {
      const response = await apiClient.post('/token', formBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      login(response.data.access_token, response.data.refresh_token);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Ocurrió un error inesperado.';
      setError(errorMessage);
    }
  };

  return (
    <form className="flex flex-col gap-4 pt-4 text-left" onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 mb-2 text-sm text-center bg-red-50 rounded-lg">
          <p className="font-semibold text-vibe-coral">{error}</p>
          {error.includes("incorrectos") && (
            <p className="mt-1 text-xs text-vibe-medium-gray">
              ¿Quizás te registraste con Google?
            </p>
          )}
        </div>
      )}
      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">
          Tu usuario o email
        </label>
        <input 
          id="username" 
          type="text" 
          placeholder="johndoe o john@doe.com" 
          required 
          onChange={handleChange}
          className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5 placeholder:text-vibe-medium-gray"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-bold font-sans text-vibe-dark-slate">
                Tu contraseña
            </label>
            <Link to="/forgot-password" className="font-sans text-xs text-vibe-teal hover:underline">
                ¿Olvidaste tu contraseña?
            </Link>
        </div>

        <div className="relative">
          <input
            id="password"
            placeholder='********'
            type={showPassword ? 'text' : 'password'}
            required
            onChange={handleChange}
            className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5 placeholder:text-vibe-medium-gray"
          />
          <div 
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <HiEyeOff className="h-5 w-5 text-vibe-medium-gray" />
            ) : (
              <HiEye className="h-5 w-5 text-vibe-medium-gray" />
            )}
          </div>
        </div>
      </div>
      
      <button 
        type="submit" 
        className="w-full text-white !bg-vibe-coral hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold font-sans rounded-lg text-sm px-5 py-2.5 text-center mt-2"
      >
        Ingresar
      </button>
    </form>
  );
}

export default LoginForm;