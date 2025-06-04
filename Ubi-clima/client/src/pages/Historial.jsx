import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000';

async function obtenerHistorial(usuario_id, mes, año) {
  const params = new URLSearchParams();
  if (mes) params.append('mes', mes);
  if (año) params.append('año', año);

  const res = await fetch(`${API_BASE}/historial/${usuario_id}?${params.toString()}`);
  if (!res.ok) throw new Error('Error al obtener historial');
  return await res.json();
}

function Historial({ usuarioId }) {
  const fechaActual = new Date();
  const [mes, setMes] = useState(String(fechaActual.getMonth() + 1).padStart(2, '0')); // "01" a "12"
  const [año, setAño] = useState(String(fechaActual.getFullYear()));
  const [historial, setHistorial] = useState([]);


  useEffect(() => {
    async function cargar() {
      try {
        if(usuarioId && mes && año) {
        const data = await obtenerHistorial(usuarioId, mes, año);
        setHistorial(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    cargar();
  }, [usuarioId, mes, año]);

  const añosDisponibles = Array.from({ length: 5 }, (_, i) => String(fechaActual.getFullYear() - i));

    return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Historial de Actividades</h2>

      <div className="flex gap-2 mb-4">
        {/* Selector de mes */}
        <select value={mes} onChange={(e) => setMes(e.target.value)} className="border p-1 rounded">
          {[...Array(12).keys()].map(i => (
            <option key={i+1} value={String(i+1).padStart(2, '0')}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        {/* Selector de año */}
        <select value={año} onChange={(e) => setAño(e.target.value)} className="border p-1 rounded">
          {añosDisponibles.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {historial.length === 0 ? (
        <p>No hay actividades registradas.</p>
      ) : (
        historial.map((item, index) => (
          <div key={index} className="border-b py-2">
            <strong>{item.nombre}</strong> – {new Date(item.fecha).toLocaleString()}
            <p className="text-sm text-gray-600">{item.descripcion}</p>
          </div>
        ))
      )}
    </div>
  );
}
export default Historial;
