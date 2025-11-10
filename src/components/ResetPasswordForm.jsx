import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Alert } from 'flowbite-react';
import { HiEye, HiEyeOff, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import apiClient from '../services/apiClient';

const Requirement = ({ valid, text }) => (
    <div className={`flex items-center transition-colors duration-300 font-sans ${valid ? 'text-vibe-teal' : 'text-vibe-medium-gray'}`}>
      {valid ? <HiCheckCircle className="mr-2 flex-shrink-0" /> : <HiXCircle className="mr-2 flex-shrink-0" />}
      <span>{text}</span>
    </div>
);

function ResetPasswordForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({ new_password: '', confirm_password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false, hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false,
    });
    const [passwordsMatch, setPasswordsMatch] = useState(null);

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (resetToken) {
            setToken(resetToken);
        } else {
            setError("Token de reseteo no encontrado o inválido. Por favor, solicita un nuevo enlace.");
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        if (id === 'new_password') {
            const validations = {
                minLength: value.length >= 8,
                hasLower: /[a-z]/.test(value),
                hasUpper: /[A-Z]/.test(value),
                hasNumber: /[0-9]/.test(value),
                hasSpecial: /[\W_]/.test(value),
            };
            setPasswordValidation(validations);
        }

        if (id === 'new_password' || id === 'confirm_password') {
            const pass = id === 'new_password' ? value : formData.new_password;
            const confirmPass = id === 'confirm_password' ? value : formData.confirm_password;
            if (confirmPass) {
                setPasswordsMatch(pass === confirmPass);
            } else {
                setPasswordsMatch(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allPasswordReqsMet = Object.values(passwordValidation).every(v => v === true);

        if (!passwordsMatch || !allPasswordReqsMet) {
            setError("La contraseña no es válida o no coincide. Por favor, verifica los requisitos.");
            return;
        }
        setError('');
        setMessage('');
        try {
            const response = await apiClient.post('/reset-password/', {
                token: token,
                new_password: formData.new_password,
            });
            setMessage(response.data.message + " Serás redirigido al login en 3 segundos.");
            setTimeout(() => navigate('/auth/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Ocurrió un error o el token ha expirado.');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-2xl p-8">
            <h3 className="font-display font-bold text-2xl text-center text-vibe-dark-slate mb-4">Establecer Nueva Contraseña</h3>
            {!message ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    <div>
                        <label htmlFor="new_password" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">Nueva Contraseña</label>
                        <div className="relative">
                            <input id="new_password" type={showPassword ? 'text' : 'password'} required onChange={handleChange} className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5 placeholder:text-vibe-medium-gray"/>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <HiEyeOff className="h-5 w-5 text-vibe-medium-gray" /> : <HiEye className="h-5 w-5 text-vibe-medium-gray" />}
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-sm mt-2">
                        <Requirement valid={passwordValidation.minLength} text="Mínimo 8 caracteres" />
                        <Requirement valid={passwordValidation.hasLower} text="Una minúscula" />
                        <Requirement valid={passwordValidation.hasUpper} text="Una mayúscula" />
                        <Requirement valid={passwordValidation.hasNumber} text="Un número" />
                        <Requirement valid={passwordValidation.hasSpecial} text="Un carácter especial" />
                    </div>

                    <div>
                        <label htmlFor="confirm_password" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">Confirmar Nueva Contraseña</label>
                         <div className="relative">
                            <input id="confirm_password" type={showPasswordConfirm ? 'text' : 'password'} required onChange={handleChange} className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5"/>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                                {showPasswordConfirm ? <HiEyeOff className="h-5 w-5 text-vibe-medium-gray" /> : <HiEye className="h-5 w-5 text-vibe-medium-gray" />}
                            </div>
                        </div>
                        {passwordsMatch === false && <p className="font-sans text-sm mt-1 text-vibe-coral">Las contraseñas no coinciden.</p>}
                    </div>

                    <button type="submit" disabled={!token} className="w-full text-white !bg-vibe-coral hover:opacity-90 font-bold font-sans rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 mt-2">
                        Actualizar Contraseña
                    </button>
                </form>
            ) : (
                <Alert color="success" className="font-sans">{message}</Alert>
            )}
            {error && <Alert color="failure" className="mt-4 font-sans">{error}</Alert>}
             <div className="text-center mt-4">
                <Link to="/auth/login" className="font-sans text-sm text-vibe-teal hover:underline">Volver a Iniciar Sesión</Link>
            </div>
        </div>
    );
}
export default ResetPasswordForm;