import { ClimaProvider } from './context/ClimaContext';
//Estos 2 imports vienen a ser los que se encargan de las "páginas". 

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


//Este import está hecho  para utilizar componentes de bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


//Estos imports están hechos para utilizar los componentes que nosotros hagamos
import WidgetClima from './components/WidgetClima'; 
import NavbarSuperior from './components/NavbarSuperior';


//Estos imports son los correspondientes a las páginas que tiene la página web
import Home from './pages/Home';
import Activities from './pages/Activities';
import Registro from './pages/Registro';
import Recuperar from './pages/Recuperar';
import Ajustes from './pages/Ajustes';
import Login from './pages/Login';
import Historial from './pages/Historial';
import Administrador from './pages/Administrador'; // Importa el componente de administrador (si lo necesitas)


//Este import es para el uso de un css personalizado.
import './index.css';


/*
Estructura del componente raiz
Es el punto de entrada donde se arma la estructura general del sitio
aquí usualmente se configuran cosas como rutas (<BrowserRouter>, <Routes>), layout global, temas, navegación, etc.
Por convención, es el que se renderiza dentro de ReactDOM.createRoot(...).render(<App />) en el main.jsx o index.js.
*/



/*


Lo que hace es envolver el componente AppContent dentro de un router, más específicamente un <BrowserRouter> 
Permite que AppContent y todos los componentes dentro de él usen funcionalidades de React Router como: <Route>, <Link>, <Navigate>, useNavigate(), useParams(), etc.
Sin este envoltorio, los componentes no sabrían manejar rutas ni navegación.
*/

function App() {
  return (
    <Router>
      <ClimaProvider> {/* ⬅️ Aquí envuelves todo con el contexto */}
        <AppContent />
      </ClimaProvider>
    </Router>	
  );
}


function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const isLogged = !!localStorage.getItem('token');

  // Detectar si estamos en la ruta del panel de administración o en login
  const isAdminPage = location.pathname.toLowerCase().startsWith('/administrador');
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {/* Mostrar NavbarSuperior y WidgetClima solo si NO estamos en login ni en admin */}
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

      {/* Contenedor principal para las páginas */}
      <div className={isAdminPage ? '' : 'container mt-5'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Activities" element={<Activities />} />
          <Route path="/Ajustes" element={<Ajustes />} />
          <Route path="/Historial" element={<Historial usuarioId={localStorage.getItem('usuario_id')} />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Recuperar" element={<Recuperar />} />
          <Route path="/Administrador" element={<Administrador />} />
          <Route path="/login" element={<div className="login-page"><Login /></div>} />
        </Routes>
      </div>
    </>
  );
}

export default AppContent;