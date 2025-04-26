import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MenuLateral from './components/MenuLateral';
import './index.css';
import Home from './pages/Home';
import Historial from './pages/Historial';
import Clima from './pages/Clima';
import Ajustes from './pages/Ajustes';
import TarjetaCiudad from './components/TarjetaCiudad';

function App() {
  return (
    <Router>
      <button
        className="btn btn-secondary m-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#menuDeslizable"
        aria-controls="menuDeslizable"
      >
        ☰ Menú
      </button>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="menuDeslizable"
        aria-labelledby="menuDeslizableLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="menuDeslizableLabel">Menú</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        <MenuLateral />
      </div>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/clima" element={<Clima />} />
          <Route path="/ajustes" element={<Ajustes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
