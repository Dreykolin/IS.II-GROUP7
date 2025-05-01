import { useEffect, useState } from 'react';
import '../assets/estilos.css'; // Asegúrate de importar tu archivo CSS

function WidgetClima() {
  const [clima, setClima] = useState('');

  useEffect(() => {
    const obtenerUbicacionYClima = async () => {
      if (!navigator.geolocation) {
        setClima("Geolocalización no disponible.");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch('http://localhost:3000/clima', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lon })
          });

          const datos = await res.json();
          setClima(`${datos.descripcion}, ${datos.temperatura}°C en ${datos.ciudad}`);
        } catch (err) {
          console.error(err);
          setClima("Error al obtener clima.");
        }
      });
    };

    obtenerUbicacionYClima();
  }, []);

  return (
    <div className="widget-clima">
      {clima || 'Cargando clima...'}
    </div>
  );
}

export default WidgetClima;

