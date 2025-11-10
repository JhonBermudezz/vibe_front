// src/pages/VerifyEmailPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Spinner, Alert } from 'flowbite-react';
import apiClient from '../services/apiClient';

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verificando tu correo...');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('No se encontró un token de verificación. El enlace puede ser inválido.');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await apiClient.get('/verify-email', {
                    params: { token },
                });
                setStatus('success');
                setMessage(response.data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.detail || 'Ocurrió un error al verificar el token.');
            }
        };

        verifyToken();
    }, [searchParams]);

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return <div className="flex flex-col items-center gap-4"><Spinner size="xl" /><p>{message}</p></div>;
            case 'success':
                return <Alert color="success">{message}</Alert>;
            case 'error':
                return <Alert color="failure">{message}</Alert>;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-2xl w-full max-w-md">
            {renderContent()}
            <Link to="/auth/login" className="mt-6 text-sm font-sans text-vibe-teal hover:underline">
                Ir a Iniciar Sesión
            </Link>
        </div>
    );
}

export default VerifyEmailPage;