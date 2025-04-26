import { useState } from 'react';
import TarjetaCiudad from "../components/TarjetaCiudad";


function Clima() {
  const [ubicacion, setUbicacion] = useState('');
  const [clima, setClima] = useState('');

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setUbicacion("La geolocalización no es compatible.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitud = position.coords.latitude;
      const longitud = position.coords.longitude;
      setUbicacion(`Latitud: ${latitud}, Longitud: ${longitud}`);

      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`);
        const geoData = await geoRes.json();
        const ciudad = geoData.address?.city || "Ciudad no encontrada";

        await fetch('http://localhost:3000/guardar_ubicacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitud, longitud, ciudad })
        });

        const climaRes = await fetch('http://localhost:3000/clima', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: latitud, lon: longitud })
        });

        const datosClima = await climaRes.json();
        setClima(`Clima: ${datosClima.descripcion}, ${datosClima.temperatura}°C en ${datosClima.ciudad}`);
      } catch (err) {
        console.error(err);
        setClima("Error al obtener ciudad o clima.");
      }
    });
  };

  return (
  <div className="container mt-4">
    <div className="row">
      {/* Contenedor izquierdo */}
      <div className="col-md-8 mb-4">
        <div style={{ backgroundColor: '#f0f8ff' }} className="p-4 rounded shadow">
          <h1 className="mb-4">Detectar mi Ubicación</h1>
          <button className="btn btn-primary rounded shadow px-4 py-2" onClick={obtenerUbicacion}>
            Buscar
          </button>
          <div className="mt-4 p-3 bg-white rounded shadow-sm">
            <p><strong>Coordenadas:</strong> {ubicacion}</p>
            <p><strong>Ciudad y Clima:</strong> {clima}</p>
          </div>
        </div>
      </div>

       {/* Contenedor derecho con 3 tarjetas individuales del mismo color */}
      <div className="col-md-4">
        {[1, 2, 3].map((num) => (
	  <TarjetaCiudad key={num} />
	))}
      </div>
    </div>
  </div>
);
}

export default Clima;

