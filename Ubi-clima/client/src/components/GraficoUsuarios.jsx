import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function GraficoUsuarios() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/usuarios_por_mes')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error('Error cargando datos de usuarios por mes:', err));
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Usuarios registrados por mes</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#4c6ef5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}