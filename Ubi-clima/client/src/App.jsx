// Importa los proveedores de contexto
import { ClimaProvider } from './context/ClimaContext';
import { AuthProvider } from './context/AuthContext'; // ⬅️ 1. Importamos nuestro AuthProvider

// Estos imports son para manejar las rutas del sitio
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
import Administrador from './pages/Administrador';

// Este import es para aplicar tu CSS personalizado
import './index.css';

function App() {
    return (
        <Router>
            {/* ⬅️ 2. Envolvemos la aplicación con AuthProvider */}
            <AuthProvider>
                <ClimaProvider>
                    <AppContent />
                </ClimaProvider>
            </AuthProvider>
        </Router>
    );
}

// ⬅️ 3. AppContent ahora es más simple y no maneja la lógica de sesión.
function AppContent() {
    const location = useLocation();

    const isAdminPage = location.pathname.toLowerCase().startsWith('/administrador');
    const isLoginPage = location.pathname === '/login';

    return (
        <>
            {/* NavbarSuperior ya no recibe props, obtiene los datos del contexto. */}
            {!isLoginPage && !isAdminPage && (
                <>
                    <NavbarSuperior />
                    <WidgetClima />
                </>
            )}

            <div className={isAdminPage ? '' : 'container mt-5'}>
                <Routes>
                    {/* Los componentes en las rutas ya no reciben props de sesión. */}
                    <Route path="/" element={<Home />} />
                    <Route path="/Activities" element={<Activities />} />
                    <Route path="/Ajustes" element={<Ajustes />} />
                    <Route path="/Historial" element={<Historial />} />
                    <Route path="/Registro" element={<Registro />} />
                    <Route path="/Recuperar" element={<Recuperar />} />
                    <Route path="/Administrador" element={<Administrador />} />
                    <Route path="/login" element={<div className="login-page"><Login /></div>} />
                </Routes>
            </div>

            <footer className="footer">
                <div className="container">
                    <p>© 2025 WeatherAct</p>
                    <ul className="footer-links">
                        <li><a href="#">Política de privacidad</a></li>
                        <li><a href="#">Contacto</a></li>
                        <li><a href="#">Redes sociales</a></li>
                    </ul>
                </div>
            </footer>
        </>
    );
}

export default App;