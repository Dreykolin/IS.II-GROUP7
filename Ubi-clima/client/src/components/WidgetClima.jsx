import { useEffect, useState } from 'react';
import '../assets/Widget_clima.css'; // Asegúrate de importar tu archivo CSS

function WidgetClima() {
  const [clima, setClima] = useState('');
  /*
  Tiene su propia función de "obtener ubicación". En un futuro se busca unificar esto, para que en vez de que lo haga el widget,
  lo haga muy seguramente el app.jsx, cosa que el dato se almacene en alguna parte y pueda ser usado tanto por el widget como
  por los demás componentes sin tener que hacer llamadas innecesarias.


useEffect: Es asíncrono, no interrumpe otras tareas.
Utiiza la función "Obtener ubiación y clima, utilizando la geolocalización del navegador y un llamado al endpoint "clima".

   */
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
//Devuelve el widget
  return (
    <div className="widget-clima">
      {clima || 'Cargando clima...'}
    </div>
  );
}

export default WidgetClima;

