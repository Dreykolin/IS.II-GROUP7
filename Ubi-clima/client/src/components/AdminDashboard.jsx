import { useEffect, useState } from 'react';
import '../assets/AdminDashboard.css';

export default function AdminDashboard() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setDatos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al cargar el dashboard:', err);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando estadísticas...</p>;
  if (!datos) return <p>Error al cargar estadísticas</p>;

  return (
    <div className="admin-dashboard">
      <h2>📊 Dashboard General</h2>
      <div className="dashboard-cards">
        <div className="card"><h3>Usuarios</h3><p>{datos.total_usuarios}</p></div>
        <div className="card"><h3>Actividades</h3><p>{datos.total_actividades}</p></div>
        <div className="card"><h3>Recomendaciones</h3><p>{datos.actividades_recomendadas}</p></div>
        <div className="card"><h3>Historial</h3><p>{datos.historial}</p></div>
      </div>
    </div>
  );
}
