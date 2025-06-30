import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ⬅️ 1. Importa el hook useAuth
import '../assets/login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // ⬅️ 2. Obtiene la función 'login' del contexto

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpia errores anteriores

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // ⬅️ 3. Lógica de inicio de sesión actualizada
            if (response.ok && data.success) {
                // En lugar de manejar localStorage aquí...
                // ...simplemente llamamos a la función del contexto con los datos del backend.
                // El AuthContext se encargará de guardar todo y actualizar el estado global.
                login(data);

                // Ya no es necesario el alert.
                navigate('/'); // Redirige al Home
            } else {
                // Usa el mensaje de error del backend si está disponible
                setError(data.message || 'Correo o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="login-container">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    {/* El resto del formulario JSX se mantiene igual */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="tucorreo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3 text-end">
                        <Link to="/Recuperar" className="forgot-password">¿Olvidaste tu contraseña?</Link>
                    </div>

                    <button type="submit" className="btn-airbnb mb-3">Entrar</button>

                    <div className="text-center">
                        <span>¿No tienes una cuenta?</span>
                        <Link to="/Registro" className="register-link">Regístrate</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;