import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Importa useNavigate
import '../assets/estilos.css'; // tu css personalizado
import 'bootstrap/dist/css/bootstrap.min.css'; // por si acaso

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Inicializa useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Llamada al backend para verificar las credenciales
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        // Si las credenciales son correctas, guarda el token (si lo necesitas)
        localStorage.setItem('token', data.token);  // Guarda el token en localStorage, si es necesario
        localStorage.setItem('usuario_id', data.usuario_id); // guarda también el ID
	alert('Inicio de sesión exitoso');	
	navigate('/'); // redirige después de iniciar sesión
      } else {
        // Si las credenciales son incorrectas, muestra un error
        setError('Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Hubo un error al procesar la solicitud');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
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

          {/* Mostrar mensaje de error si es necesario */}
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

