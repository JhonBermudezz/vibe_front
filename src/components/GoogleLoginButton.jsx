import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

function GoogleLoginButton() {
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Token de Google recibido:", credentialResponse);
    const idToken = credentialResponse.credential;

    try {
      const response = await apiClient.post('/auth/google', {
        credential: idToken,
      });

      const { access_token, refresh_token } = response.data;

      login(access_token, refresh_token);

    } catch (error) {
      console.error("Error en el login con Google:", error);
      alert("Hubo un error al iniciar sesión con Google. Por favor, inténtalo de nuevo.");
    }
  };

  const handleGoogleError = () => {
    console.log('Login con Google fallido');
    alert("El inicio de sesión con Google falló. Por favor, inténtalo de nuevo.");
  };

  return (
    <div className="flex justify-center">
        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap 
        />
    </div>
  );
}

export default GoogleLoginButton;