import { Link } from 'react-router-dom';
import '../assets/NavBar.css';
import sun from '../images/sun.png'; // Importas la imagen

export default function NavbarSuperior({ isLogged, handleLoginRedirect, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Logo + nombre de la app */}
        <div className="d-flex align-items-center">
          <img src={sun} alt="WeatherAct Logo" className="navbar-logo me-2" />
          <span className="navbar-brand mb-0 h1">WeatherAct</span>
        </div>
        
        {/* Links de navegación */}
        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/activities">Actividades</Link>
          </li>
        </ul>

        {/* Botón login/logout */}
        <div>
          {isLogged ? (
            <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
          ) : (
            <button className="btn btn-primary" onClick={handleLoginRedirect}>Iniciar sesión</button>
          )}
        </div>
      </div>
    </nav>
  );
}

