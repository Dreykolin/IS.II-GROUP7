import '../assets/AdminUsuarios.css';
import { useEffect, useState } from 'react';
import GraficoUsuarios from '../components/GraficoUsuarios';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/usuarios')
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudo cargar la lista de usuarios');
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="admin-usuarios">
      <h2>Usuarios registrados</h2>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📊 Gráfico de usuarios mensuales */}
      <GraficoUsuarios />

      {/* 📈 Panel de estadísticas generales */}
      <AdminDashboard />
    </section>
  );
}
