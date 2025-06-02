import { useState } from 'react';
import AdminAjustes from './AdminAjustes';
import PreferenceSelector from './PreferenceSelector';
import RecommendationsList from './RecommendationsList';
// import AdminUsuarios from './AdminUsuarios'; // Para cuando lo uses
import '../assets/Administrador.css';

export default function Administrador() {
  const [seccion, setSeccion] = useState('home');

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>AdminPanel</h2>
        <ul>
          <li onClick={() => setSeccion('usuarios')} style={{ cursor: 'pointer' }}>
            Usuarios
          </li>
          <li onClick={() => setSeccion('gustos')} style={{ cursor: 'pointer' }}>
            Gustos
          </li>
          <li onClick={() => setSeccion('recomendaciones')} style={{ cursor: 'pointer' }}>
            Recomendaciones
          </li>
          <li onClick={() => setSeccion('ajustes')} style={{ cursor: 'pointer' }}>
            Ajustes
          </li>
        </ul>
      </aside>

      <main className="admin-content">
        {seccion === 'home' && (
          <>
            <h1>Bienvenido, administrador</h1>
            <p>Aquí puedes gestionar todo el sistema.</p>
          </>
        )}

        {seccion === 'ajustes' && <AdminAjustes volverHome={() => setSeccion('home')} />}
        {seccion === 'gustos' && <PreferenceSelector />}
        {seccion === 'recomendaciones' && <RecommendationsList />}
        {seccion === 'usuarios' && <AdminUsuarios />}
      </main>
    </div>
  );
}
