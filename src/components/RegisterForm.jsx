import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { Alert } from 'flowbite-react';
import apiClient from '../services/apiClient';

function RegisterForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agreesToPolicies: false,
    agreesToTerms: false,
  });

  const [alert, setAlert] = useState({ show: false, color: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false, hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    const newFormData = { ...formData, [id]: finalValue };
    setFormData(newFormData);

    if (id === 'password') {
      const validations = {
        minLength: value.length >= 8, hasLower: /[a-z]/.test(value),
        hasUpper: /[A-Z]/.test(value), hasNumber: /[0-9]/.test(value),
        hasSpecial: /[\W_]/.test(value),
      };
      setPasswordValidation(validations);
    }

    if (id === 'password' || id === 'passwordConfirm') {
        const pass = id === 'password' ? value : newFormData.password;
        const confirmPass = id === 'passwordConfirm' ? value : newFormData.passwordConfirm;
        if (confirmPass) {
            setPasswordsMatch(pass === confirmPass);
        } else {
            setPasswordsMatch(null);
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, color: '', message: '' });

    if (!formData.agreesToPolicies || !formData.agreesToTerms) {
        setAlert({ show: true, color: 'failure', message: 'Debes aceptar los términos y políticas.' });
        return;
    }
    if (formData.password !== formData.passwordConfirm) {
        setAlert({ show: true, color: 'failure', message: 'Las contraseñas no coinciden.' });
        return;
    }

    const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.passwordConfirm
    };

    try {
      await apiClient.post('/users/', payload);
      setAlert({ show: true, color: 'success', message: '¡Registro exitoso! Redirigiendo a Iniciar Sesión...' });
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Ocurrió un error inesperado.';
      const finalMessage = Array.isArray(errorMessage) 
        ? errorMessage.map(err => `${err.loc[1]}: ${err.msg}`).join(', ')
        : errorMessage;
      setAlert({ show: true, color: 'failure', message: `Error: ${finalMessage}` });
    }
  };
  
  return (
    <form className="flex flex-col gap-4 pt-4 text-left" onSubmit={handleSubmit}>
      {alert.show && (
        <Alert color={alert.color} onDismiss={() => setAlert({ show: false, color: '', message: '' })}>
          <span className="font-sans">{alert.message}</span>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">Nombre</label>
          <input id="firstName" type="text" placeholder="Jhon" required onChange={handleChange} className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5 placeholder:text-vibe-medium-gray"/>
        </div>
        <div>
          <label htmlFor="lastName" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">Apellido</label>
          <input id="lastName" type="text" placeholder="Doe" required onChange={handleChange} className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5 placeholder:text-vibe-medium-gray"/>
        </div>
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">Fecha de Nacimiento</label>
        <input id="dateOfBirth" type="date" required onChange={handleChange} className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5"/>
      </div>

      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">Tu nombre de usuario</label>
        <input id="username" type="text" placeholder="Elige un nombre de usuario" required onChange={handleChange} className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5 placeholder:text-vibe-medium-gray"/>
      </div>
      
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">Tu correo electrónico</label>
        <input id="email" type="email" placeholder="nombre@ejemplo.com" required onChange={handleChange} className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5 placeholder:text-vibe-medium-gray"/>
      </div>

      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">Tu contraseña</label>
        <div className="relative">
          <input id="password" type={showPassword ? 'text' : 'password'} placeholder="********" required onChange={handleChange} className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5 placeholder:text-vibe-medium-gray"/>
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
        <label htmlFor="passwordConfirm" className="block mb-2 text-sm font-bold font-sans text-vibe-dark-slate">Confirmar contraseña</label>
        <div className="relative">
            <input id="passwordConfirm" type={showPasswordConfirm ? 'text' : 'password'} placeholder="********" required onChange={handleChange} className="font-sans bg-gray-50 border border-gray-300 text-vibe-dark-slate text-sm rounded-lg focus:ring-vibe-teal focus:border-vibe-teal block w-full p-2.5 placeholder:text-vibe-medium-gray"/>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                {showPasswordConfirm ? <HiEyeOff className="h-5 w-5 text-vibe-medium-gray" /> : <HiEye className="h-5 w-5 text-vibe-medium-gray" />}
            </div>
        </div>
        {passwordsMatch === false && <p className="font-sans text-sm mt-1 text-vibe-coral">Las contraseñas no coinciden.</p>}
        {passwordsMatch === true && <p className="font-sans text-sm mt-1 text-vibe-teal">Las contraseñas coinciden.</p>}
      </div>

      <div className="flex items-center gap-2">
        <input id="agreesToTerms" type="checkbox" onChange={handleChange} className="w-4 h-4 text-vibe-teal bg-gray-100 border-gray-300 rounded focus:ring-vibe-teal"/>
        <label htmlFor="agreesToTerms" className="ms-2 text-sm font-sans text-vibe-medium-gray">Acepto los&nbsp;<a href="#" className="text-vibe-teal hover:underline">Términos y Condiciones</a></label>
      </div>
      <div className="flex items-center gap-2">
        <input id="agreesToPolicies" type="checkbox" onChange={handleChange} className="w-4 h-4 text-vibe-teal bg-gray-100 border-gray-300 rounded focus:ring-vibe-teal"/>
        <label htmlFor="agreesToPolicies" className="ms-2 text-sm font-sans text-vibe-medium-gray">Acepto las&nbsp;<a href="#" className="text-vibe-teal hover:underline">Políticas de Privacidad</a></label>
      </div>
      
      <button type="submit" className="w-full text-white !bg-vibe-coral hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold font-sans rounded-lg text-sm px-5 py-2.5 text-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!formData.agreesToPolicies || !formData.agreesToTerms}>
        Registrar nueva cuenta
      </button>
    </form>
  );
}

const Requirement = ({ valid, text }) => (
  <div className={`flex items-center transition-colors duration-300 font-sans ${valid ? 'text-vibe-teal' : 'text-vibe-medium-gray'}`}>
    {valid ? <HiCheckCircle className="mr-2 flex-shrink-0" /> : <HiXCircle className="mr-2 flex-shrink-0" />}
    <span>{text}</span>
  </div>
);

export default RegisterForm;