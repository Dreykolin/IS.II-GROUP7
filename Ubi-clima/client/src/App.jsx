// Importa el proveedor del contexto de clima
import { ClimaProvider } from './context/ClimaContext';

// Estos imports son para manejar las rutas del sitio
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Este import permite usar componentes de Bootstrap (como modales, dropdowns, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Estos imports son para utilizar los componentes personalizados de tu app
import WidgetClima from './components/WidgetClima'; 
import NavbarSuperior from './components/NavbarSuperior';

// Estos imports corresponden a las páginas del sitio web
import Home from './pages/Home';
import Activities from './pages/Activities';
import Registro from './pages/Registro';
import Recuperar from './pages/Recuperar';
import Ajustes from './pages/Ajustes';
import Login from './pages/Login';
import Historial from './pages/Historial';
import Administrador from './pages/Administrador'; // Importa el componente de administrador

// Este import es para aplicar tu CSS personalizado
import './index.css';

/*
Componente raíz de la aplicación
Este es el punto de entrada principal donde se arma la estructura general del sitio.
Aquí se configuran rutas (<Router>, <Routes>), layout global, navegación, temas, etc.
Por convención, es el componente que se renderiza dentro de ReactDOM.createRoot(...).render(<App />)
*/
function App() {
  return (
    <Router>
      <ClimaProvider> {/* ⬅️ Envuelve toda la app con el contexto para compartir datos de clima */}
        <AppContent /> {/* Contiene la lógica principal y las rutas */}
      </ClimaProvider>
    </Router>
  );
}

// Este componente contiene el contenido dinámico de la aplicación
function AppContent() {
  const navigate = useNavigate();        // Permite redireccionar programáticamente
  const location = useLocation();        // Permite detectar en qué ruta estamos

  // Función para redirigir a la página de login
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); // Recarga la página para aplicar el logout
  };

  // Verifica si el usuario está logueado
  const isLogged = !!localStorage.getItem('token');

  // Detecta si estamos en la ruta del panel de administración o login
  const isAdminPage = location.pathname.toLowerCase().startsWith('/administrador');
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {/* Mostrar Navbar y WidgetClima solo si NO estamos en login ni admin */}
      {!isLoginPage && !isAdminPage && (
        <>
          <NavbarSuperior 
            isLogged={isLogged} 
            handleLoginRedirect={handleLoginRedirect} 
            handleLogout={handleLogout}
          />
          <WidgetClima />
        </>
      )}

      {/* Contenedor principal para las páginas. Si estamos en admin, quitamos margen y clase container */}
      <div className={isAdminPage ? '' : 'container mt-5'}>
        <Routes>
          <Route path="/" element={<Home handleLoginRedirect={handleLoginRedirect} />} />
          <Route path="/Activities" element={<Activities />} />
          <Route path="/Ajustes" element={<Ajustes />} />
          <Route path="/Historial" element={<Historial usuarioId={localStorage.getItem('usuario_id')} />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Recuperar" element={<Recuperar />} />
          <Route path="/Administrador" element={<Administrador />} />
          <Route path="/login" element={<div className="login-page"><Login /></div>} />
        </Routes>
      </div>
      <footer class="footer">
        <div class="container">
          <p>© 2025 WeatherAct</p>
          <ul class="footer-links">
            <li><a href="#">Política de privacidad</a></li>
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Redes sociales</a></li>
          </ul>
        </div>
      </footer>
    </>
  );
}

export default App; // ✅ Esto exporta correctamente el componente raíz App
