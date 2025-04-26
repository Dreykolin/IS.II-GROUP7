import { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
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
      {/* Botón para abrir el menú deslizable */}
      <button
        className="btn btn-secondary mb-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#menuDeslizable"
        aria-controls="menuDeslizable"
      >
        ☰ Menú
      </button>

      {/* Menú deslizable */}
      <div
        className="offcanvas offcanvas-begin"
        tabIndex="-1"
        id="menuDeslizable"
        aria-labelledby="menuDeslizableLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="menuDeslizableLabel">Opciones</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        <div className="offcanvas-body d-grid gap-2">
	  <button className="btn btn-outline-primary" type="button">
	    🌍 Ver historial de ubicaciones
	  </button>
	  <button className="btn btn-outline-success" type="button">
	    ☁️ Últimos climas
	  </button>
	  <button className="btn btn-outline-secondary" type="button">
	    ⚙️ Ajustes
	  </button>
	</div>
      </div>

      {/* Contenido principal */}
      <div className="bg-light p-4 rounded shadow">
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
  );
}

export default App;

