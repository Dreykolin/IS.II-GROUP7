import { useState, useEffect } from 'react';
import { useClima } from '../../context/ClimaContext'; // Usamos el contexto para obtener los datos del clima

function TarjetaCiudad() {
  const { datosClima, actualizarClima } = useClima(); // Usamos el contexto para obtener los datos del clima
  const [editando, setEditando] = useState(false);
  const [ciudad, setCiudad] = useState('');
  const [inputCiudad, setInputCiudad] = useState('');
  const [clima, setClima] = useState('');
  const [temp, setTemp] = useState('');
  const [humedad, setHumedad] = useState('');
  const [viento, setViento] = useState('');

  // Este useEffect se asegura de que los datos del clima se tomen del contexto al inicio
  useEffect(() => {
    if (datosClima) {
      setCiudad(datosClima.ciudad);
      setClima(capitalizeFirstLetter(datosClima.descripcion));
      setTemp(`${Math.round(datosClima.temperatura)}°C`);
      setHumedad(`${datosClima.humedad}%`);
      setViento(`${datosClima.viento} km/h`);
    }
  }, [datosClima]); // Solo se ejecuta si 'datosClima' cambian

  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  const manejarGuardar = async () => {
    if (!inputCiudad) return; // Si el campo de ciudad está vacío, no hacemos nada

    try {
      const res = await fetch('http://localhost:3000/clima_por_ciudad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ciudad: inputCiudad }),
      });

      if (!res.ok) throw new Error('Error al obtener clima de la ciudad');

      const datos = await res.json();
      setCiudad(datos.ciudad);
      setClima(capitalizeFirstLetter(datos.descripcion));
      setTemp(`${Math.round(datos.temperatura)}°C`);
      setHumedad(`${datos.humedad}%`);
      setViento(`${datos.viento} km/h`);

      // Actualizamos el contexto con los nuevos datos de clima
      actualizarClima({ clima: datos });

      setEditando(false);
    } catch (err) {
      console.error(err);
      setClima('No se pudo obtener el clima.');
    }
  };

  return (
  <div className='fullsize'>
    {!editando ? (
        <div>
          <h2>🏙️ {ciudad || 'Sin ciudad asignada'}</h2>
          <button
            className="btn-cambiarciudad"
            onClick={() => setEditando(true)}
          >
            Cambiar Ciudad
          </button>
        </div>
      ) : (
        <div>
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
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setEditando(false)}
          >
            Cancelar
          </button>
        </div>
      )}

    <div className="weather-cards" >
      
      <div className="weather-card">
        <span className="icon">🌫️</span>
        <div>
        <strong>Clima</strong>
        {clima && <p>{clima}</p>}
        </div>
      </div>
      <div className="weather-card">
        <span className="icon">🌡️</span>
        <div>
        <strong>Temperatura</strong>
        {temp && <p>{temp}</p>}
        </div>
      </div>
      <div className="weather-card">
        <span className="icon">💧</span>
        <div>
          <strong>Humedad</strong>
          {humedad && <p>{humedad}</p>}
        </div>
      </div>
      <div className="weather-card">
        <span className="icon">💨</span>
        <div>
        <strong>Viento</strong>
          {viento && <p>{viento}</p>}
        </div>
      </div>
    </div>
  </div>
  );
}

export default TarjetaCiudad;
