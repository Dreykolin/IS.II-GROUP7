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
      setClima(datosClima.descripcion);
      setTemp(`${Math.round(datosClima.temperatura)}°C`);
      setHumedad(`${datosClima.humedad}%`);
      setViento(`${datosClima.viento} km/h`);
    }
  }, [datosClima]); // Solo se ejecuta si 'datosClima' cambian

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
      setClima(datos.descripcion);
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
    <div className="weather-cards">
      <div className="weather-card">
        <span className="icon">🌫️</span>
        <p>Clima</p>
        {clima && <strong>{clima}</strong>}
      </div>
      <div className="weather-card">
        <span className="icon">🌡️</span>
        <p>Temperatura</p>
        {temp && <strong>{temp}</strong>}
      </div>

      {!editando ? (
        <div className="weather-card">
          <span className="icon">🏙️</span>
          <p>Ciudad</p>
          <strong>{ciudad || 'Sin ciudad asignada'}</strong>
          <button
            className="btn btn-sm btn-info mt-2"
            onClick={() => setEditando(true)}
          >
            Editar Ciudad
          </button>
        </div>
      ) : (
        <div className="weather-card">
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

      <div className="weather-card">
        <span className="icon">💧</span>
        <p>Humedad</p>
        {humedad && <strong>{humedad}</strong>}
      </div>
      <div className="weather-card">
        <span className="icon">💨</span>
        <p>Viento</p>
        {viento && <strong>{viento}</strong>}
      </div>
    </div>
  );
}

export default TarjetaCiudad;
