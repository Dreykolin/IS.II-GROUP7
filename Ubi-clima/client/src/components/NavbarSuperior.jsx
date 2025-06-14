import { Link } from 'react-router-dom';
import '../assets/NavBar.css';
import sun from '../images/sun.png'; // Importas la imagen
import { urlBase64ToUint8Array } from '../utils';

const PUBLIC_VAPID_KEY = "BPaW76e491m4ebBJFa2s5aswfKU6jhSoVFDsAV_z0cbFFe5uGinqGn9PC15ZG7iQ6kopIZ3u4rnUCRqrkcXm3wc";
export default function NavbarSuperior({ isLogged, handleLoginRedirect, handleLogout }) {
  const suscribeNotification = () => {
    // Esto va pa una fun
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
        <div className="d-flex align-items-center navbar-contenedor-logo">
          <img src={sun} alt="WeatherAct Logo" className="navbar-logo me-2" />
          <span className="navbar-titulo">WeatherAct</span>
        </div>
        
        {/* Links de navegación */}
        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/activities">Mis Actividades</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/Ajustes">Ajustes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/Historial">Historial</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/Administrador">Administrador</Link>
          </li>
        </ul>

        {/* Botón login/logout */}
       <div className="d-flex align-items-center gap-2">
       <button className="btn-notifications" onClick={suscribeNotification}>
  Notificaciones
        </button>
  {isLogged ? (
    <button className="btn-notifications" onClick={handleLogout}>Cerrar sesión</button>
  ) : (
  <button className="btn-notifications" onClick={handleLoginRedirect}>Iniciar sesión</button>
  	
   
  )}
   
</div>
      </div>
    </nav>
  );
}
