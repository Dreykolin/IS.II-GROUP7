import { Link } from 'react-router-dom';

export default function NavbarSuperior({ isLogged, handleLoginRedirect, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-between">
        
        {/* Nombre de la app a la izquierda */}
        <span className="navbar-brand mb-0 h1">WeatherAct</span>
        
        {/* Links de navegación a la izquierda del botón de Iniciar sesión */}
        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/historial">Historial</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/clima">Clima</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ajustes">Ajustes</Link>
          </li>
        </ul>
        
        {/* Botón de login o logout a la derecha */}
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

