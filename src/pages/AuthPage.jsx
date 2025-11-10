import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from 'flowbite-react'; 
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import GoogleLoginButton from '../components/GoogleLoginButton';

function AuthPage() {
    const { tab } = useParams();

    const isLogin = tab !== 'register';

    return (
        <div className="text-center p-4">
            <h1 className="font-display font-bold text-4xl text-white mb-2" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                Bienvenido a VIBE
            </h1>
            <p className="font-sans text-lg text-gray-200 mb-8" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                Crea una cuenta o inicia sesión para construir tus hábitos.
            </p>
            
            <Card className="w-full max-w-md mx-auto !bg-white shadow-2xl p-4 sm:p-6">
                <div className="flex border-b border-gray-200 mb-4">
                    
                    <Link
                        to="/auth/login"
                        className={`flex-1 py-3 px-1 text-center text-sm font-display font-semibold transition-colors duration-300 focus:outline-none ${
                            isLogin 
                                ? 'border-b-2 border-vibe-teal text-vibe-teal' 
                                : 'border-b-2 border-transparent text-vibe-medium-gray hover:text-vibe-teal'
                        }`}
                    >
                        Iniciar Sesión
                    </Link>
                    
                    <Link
                        to="/auth/register"
                        className={`flex-1 py-3 px-1 text-center text-sm font-display font-semibold transition-colors duration-300 focus:outline-none ${
                            !isLogin
                                ? 'border-b-2 border-vibe-teal text-vibe-teal' 
                                : 'border-b-2 border-transparent text-vibe-medium-gray hover:text-vibe-teal'
                        }`}
                    >
                        Registrarse
                    </Link>

                </div>

                <div>
                    {isLogin ? <LoginForm /> : <RegisterForm />}
                </div>
                <div className="text-right -mt-2 mb-4 px-1">
                </div>

                <div className="mt-0">
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="font-sans flex-shrink mx-4 text-xs text-vibe-medium-gray">O CONTINUAR CON</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    <div className="mt-6"><GoogleLoginButton /></div>
                </div>
            </Card>
        </div>
    );
}

export default AuthPage;