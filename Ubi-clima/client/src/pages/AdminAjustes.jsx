import { useNavigate } from 'react-router-dom';
import '../assets/AdminAjustes.css';

export default function AdminAjustes() {
  const navigate = useNavigate();

  const salirDelModoAdmin = () => {
    navigate('/usuario'); // O la ruta que tengas para el usuario normal
  };

  return (
    <div className="admin-ajustes">
      <h2>Configuración de Ajustes</h2>
      <p>Aquí puedes modificar las configuraciones del sistema.</p>
      <button onClick={salirDelModoAdmin} className="btn btn-primary mt-3">
        Volver al inicio
      </button>
    </div>
  );
}
