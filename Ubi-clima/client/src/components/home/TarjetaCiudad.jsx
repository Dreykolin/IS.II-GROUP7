/** 
MUy probablemente este componente será reworkeado, porque el problmea no es que haga dos llamadas al clima
sino que lo hace a travez de 2 endpoints diferentes.

Por otro lado, el uso de "tarjetas" para que posean el mismo tamaño, es correcto.



*/



import { useState, useEffect } from 'react';

function TarjetaCiudad({ automatico, clima: climaProp, ubicacion: ubicacionProp }) {
  const [editando, setEditando] = useState(false);
  const [ciudad, setCiudad] = useState('');
  const [inputCiudad, setInputCiudad] = useState('');
  const [clima, setClima] = useState(climaProp || '');
  const [temp, setTemp] = useState(climaProp || '');

  useEffect(() => {
    if (automatico && climaProp) {
      setClima(climaProp);
    }
  }, [automatico, climaProp]);

  const manejarGuardar = async () => {
    try {
      const res = await fetch('http://localhost:3000/clima_por_ciudad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ciudad: inputCiudad }),
      });

      if (!res.ok) throw new Error('Error en la API');

      const datos = await res.json();
      setCiudad(datos.ciudad);
      setClima(`${datos.descripcion}`);
      setTemp(`${datos.temperatura}°C`)
      setEditando(false);
    } catch (err) {
      console.error(err);
      setClima('No se pudo obtener el clima.');
    }
  };

  return (
    <div
      className="weather-cards"
    >
      {!editando ? (
        <div class="weather-card">
          <span class="icon">🏙️</span>
          <p>Ciudad</p>
          <strong>{automatico && ubicacionProp ? ubicacionProp : (ciudad || 'Sin ciudad asignada')}</strong>
          {!automatico && <button className="btn btn-sm btn-info mt-2" onClick={() => setEditando(true)}>Editar Ciudad</button>}
        </div>
      ) : (
        <div class="weather-card">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Escribe tu ciudad"
            value={inputCiudad}
            onChange={(e) => setInputCiudad(e.target.value)}
          />
          <button className="btn btn-sm btn-success me-2" onClick={manejarGuardar}>
            Guardar
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => setEditando(false)}>
            Cancelar
          </button>
        </div>
      )}
      <div class="weather-card">
        <span class="icon">🌫️</span>
        <p>Clima</p>
        {clima && <strong>{clima}</strong>}
      </div>
      <div class="weather-card">
        <span class="icon">🌡️</span>
        <p>Temperatura</p>
        {temp && <strong>{temp}</strong>}
      </div>
      
      <div class="weather-card">
        <span class="icon">☀️</span>
        <p>Índice UV</p>
        <strong>5</strong>
      </div>
      <div class="weather-card">
        <span class="icon">💧</span>
        <p>Humedad</p>
        <strong>60%</strong>
      </div>
      <div class="weather-card">
        <span class="icon">🌧️</span>
        <p>Lluvia prevista</p>
        <strong>10%</strong>
      </div>
      <div class="weather-card">
        <span class="icon">💨</span>
        <p>Viento</p>
        <strong>12 km/h</strong>
      </div>
    </div>
  );
}

export default TarjetaCiudad;
