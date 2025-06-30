import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ⬅️ 1. Importa el hook useAuth
import '../assets/NavBar.css';
import sun from '../images/sun.png';
import { urlBase64ToUint8Array } from '../utils';

const PUBLIC_VAPID_KEY = "BPaW76e491m4ebBJFa2s5aswfKU6jhSoVFDsAV_z0cbFFe5uGinqGn9PC15ZG7iQ6kopIZ3u4rnUCRqrkcXm3wc";

// ⬅️ 2. El componente ya no recibe props
export default function NavbarSuperior() {
    // ⬅️ 3. Obtenemos todo lo que necesitamos desde el contexto
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const suscribeNotification = () => {
        // ... (tu lógica de notificaciones se mantiene igual)
        console.log('WUAU');
        const permission = localStorage.getItem('permission');
        if (permission === 'granted') {
            navigator.serviceWorker.register('/sw.js').then(async (reg) => {
                console.log('Service Worker registered');
                const subscription = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
                });
                await fetch('http://localhost:3000/subscribe', {
                    method: 'POST',
                    body: JSON.stringify(subscription),
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log('Subscribed to push notifications');
            });
        } else {
            console.warn('Notification permission denied or dismissed');
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid d-flex justify-content-between align-items-center">

                {/* Logo + nombre de la app */}
                <Link to="/" className="d-flex align-items-center navbar-contenedor-logo text-decoration-none">
                    <img src={sun} alt="WeatherAct Logo" className="navbar-logo me-2" />
                    <span className="navbar-titulo">WeatherAct</span>
                </Link>

                {/* Links de navegación */}
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/">Inicio</NavLink>
                    </li>
                    {/* Mostramos estos links solo si el usuario está logueado */}
                    {isAuthenticated && (
                        <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/activities">Mis Actividades</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/Ajustes">Ajustes</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/Historial">Historial</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/Administrador">Administrador</NavLink>
                            </li>
                        </>
                    )}
                </ul>

                {/* Botones de acción */}
                <div className="d-flex align-items-center gap-2">
                    <button className="btn-notifications" onClick={suscribeNotification}>
                        Notificaciones
                    </button>
                    {/* ⬅️ 4. Usamos 'isAuthenticated' del contexto en lugar de 'isLogged' */}
                    {isAuthenticated ? (
                        // ⬅️ 5. Usamos la función 'logout' del contexto directamente
                        <button className="btn-notifications" onClick={logout}>Cerrar sesión</button>
                    ) : (
                        // ⬅️ 6. Usamos la función local 'handleLoginRedirect'
                        <button className="btn-notifications" onClick={handleLoginRedirect}>Iniciar sesión</button>
                    )}
                </div>
            </div>
        </nav>
    );
}
