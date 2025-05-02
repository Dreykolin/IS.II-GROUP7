import React, { useState, useEffect } from 'react';

function Activities() {
  const [ubicacion, setUbicacion] = useState('');
  const [clima, setClima] = useState({});
  const [actividades, setActividades] = useState([]);
  const [preferencias, setPreferencias] = useState({
    relajación: 5,
    ejercicio: 5,
    ocio: 5,
  });

  const obtenerUbicacionYClima = () => {
    if (!navigator.geolocation) {
      setUbicacion('Geolocalización no soportada.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setUbicacion(`Latitud: ${lat}, Longitud: ${lon}`);

      try {
        const res = await fetch('http://localhost:3000/clima', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lon }),
        });

        const data = await res.json();
        setClima(data);

        const resRecomendacion = await fetch('http://localhost:3000/recomendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            temperatura: data.temperatura,
            viento: data.viento,
            tiempo_id: data.tiempo_id,
            preferencias,
          }),
        });

        const { actividades } = await resRecomendacion.json();
        setActividades(actividades);

      } catch (error) {
        console.error('Error obteniendo datos del clima o recomendación:', error);
      }
    });
  };

  useEffect(() => {
    obtenerUbicacionYClima();
  }, [preferencias]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferencias(prev => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <h1>Actividades recomendadas</h1>
      <p><strong>Ubicación:</strong> {ubicacion}</p>
      <p><strong>Clima:</strong> {clima.descripcion} ({clima.temperatura}°C, viento: {clima.viento} m/s)</p>

      <h3>Ajusta tus preferencias</h3>
      {['relajación', 'ejercicio', 'ocio'].map(pref => (
        <div key={pref}>
          <label>{pref}: </label>
          <input
            type="range"
            min="0"
            max="10"
            name={pref}
            value={preferencias[pref]}
            onChange={handleChange}
          />
          <span> {preferencias[pref]}</span>
        </div>
      ))}

      <h3>Actividades sugeridas</h3>
      {actividades.length > 0 ? (
        <ul>
          {actividades.map((act, i) => (
            <li key={i}>
              <strong>{act.nombre}</strong> - {act.categoria} {act.exterior ? '(exterior)' : '(interior)'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron actividades aún.</p>
      )}
    </div>
  );
}

export default Activities;

