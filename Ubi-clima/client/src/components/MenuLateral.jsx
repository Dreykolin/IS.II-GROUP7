import { useNavigate } from 'react-router-dom';

function MenuLateral() {
  const navigate = useNavigate();

  return (
    <div className="offcanvas-body d-grid gap-2">
      <button className="btn btn-outline-primary" onClick={() => navigate('/')}>
        🌍 Inicio
      </button>
      <button className="btn btn-outline-success" onClick={() => navigate('/historial')}>
        📍 Historial
      </button>
      <button className="btn btn-outline-info" onClick={() => navigate('/clima')}>
        ☁️ Clima
      </button>
      <button className="btn btn-outline-secondary" onClick={() => navigate('/ajustes')}>
        ⚙️ Ajustes
      </button>
    </div>
  );
}

export default MenuLateral;
