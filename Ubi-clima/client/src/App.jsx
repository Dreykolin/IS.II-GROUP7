import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MenuLateral from './components/MenuLateral';
import WidgetClima from './components/WidgetClima'; // No se muestra en todas las páginas
import NavbarSuperior from './components/NavbarSuperior'; // El Navbar con pestañas
import Home from './pages/Home';
import Activities from './pages/Activities';
import Historial from './pages/Historial';
import Clima from './pages/Clima';
import Ajustes from './pages/Ajustes';
import Login from './pages/Login';
import './index.css';
import { urlBase64ToUint8Array } from './utils';

const PUBLIC_VAPID_KEY = "BPaW76e491m4ebBJFa2s5aswfKU6jhSoVFDsAV_z0cbFFe5uGinqGn9PC15ZG7iQ6kopIZ3u4rnUCRqrkcXm3wc";
function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
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
      });
    }
  }, []);

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
          <Route path="/login" element={<div className="login-page"><Login /></div>} />
        </Routes>
      </div>
    </>
  );
}

export default App;


