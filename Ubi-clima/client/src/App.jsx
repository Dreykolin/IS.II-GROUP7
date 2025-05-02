import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MenuLateral from './components/MenuLateral';
import WidgetClima from './components/WidgetClima'; // No se muestra en todas las páginas
import NavbarSuperior from './components/NavbarSuperior'; // El Navbar con pestañas

import Home from './pages/Home';
import Activities from './pages/Activities';
import Registro from './pages/Registro';
import Recuperar from './pages/Recuperar';
import Historial from './pages/Historial';
import Clima from './pages/Clima';
import Ajustes from './pages/Ajustes';
import Login from './pages/Login';
import './index.css';

function App() {
  return (
    <Router>
      <AppContent />
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
    navigate('/login');
  };

  const isLogged = !!localStorage.getItem('token');

  return (
    <>
      {location.pathname !== '/login' && (
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
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
	        <Route path="/Activities" element={<Activities />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/clima" element={<Clima />} />
          <Route path="/ajustes" element={<Ajustes />} />
	  <Route path="/Registro" element={<Registro />} />
	  <Route path="/Recuperar" element={<Recuperar />} />
          <Route path="/login" element={<div className="login-page"><Login /></div>} />
        </Routes>
      </div>
    </>
  );
}

export default App;


