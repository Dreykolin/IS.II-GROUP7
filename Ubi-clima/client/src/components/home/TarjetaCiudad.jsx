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
  const [temp, setTemp] = useState('');
  const [humedad, setHumedad] = useState('');
  const [viento, setViento] = useState('');

  useEffect(() => {
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch("http://localhost:3000/clima", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }),
          });

          if (!res.ok) throw new Error("Error al obtener clima");

          const datos = await res.json();
          setCiudad(datos.ciudad);
          setHumedad(`${datos.humedad}%`);
          setViento(`${datos.viento} km/h`);
          setClima(`${datos.descripcion}`);
          setTemp(`${Math.round(datos.temperatura)}°C`)
          
          setEditando(false);
        
        } catch (error) {
          console.error(error);
        }
      });

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
      setHumedad(`${datos.humedad}%`);
      setViento(`${datos.viento} km/h`);
      setClima(`${datos.descripcion}`);
      setTemp(`${Math.round(datos.temperatura)}°C`)
      
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
        <span class="icon">💧</span>
        <p>Humedad</p>
        {humedad && <strong>{humedad}</strong>}
      </div>
      <div class="weather-card">
        <span class="icon">💨</span>
        <p>Viento</p>
        {viento && <strong>{viento}</strong>}
      </div>
    </div>
  );
}

export default TarjetaCiudad;
