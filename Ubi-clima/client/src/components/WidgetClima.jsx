import { useState, useEffect } from 'react';
import { useClima } from '../context/ClimaContext';
import '../assets/Widget_clima.css';

function WidgetClima() {
  const { datosClima, obtenerUbicacionYClima, puedeActualizar } = useClima();
  const [cargando, setCargando] = useState(false);
  const [climaTexto, setClimaTexto] = useState('');

  useEffect(() => {
    if (datosClima) {
      setClimaTexto(`${Math.round(datosClima.temperatura)}°C y con ${datosClima.descripcion} en ${datosClima.ciudad}` );
      setCargando(false);
    } else {
      setClimaTexto('Cargando clima...');
      setCargando(true);
    }
  }, [datosClima]);

  const handleActualizar = () => {
    if (!puedeActualizar || cargando) return;
    setCargando(true);
    obtenerUbicacionYClima();
  };

  return (
    <div className="widget-clima">
      <p>{cargando ? 'Actualizando clima...' : climaTexto}</p>
      <button
        onClick={handleActualizar}
        disabled={cargando || !puedeActualizar}
        style={{
          opacity: cargando || !puedeActualizar ? 0.5 : 1,
          cursor: cargando || !puedeActualizar ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.3s',
        }}
      >
        {cargando ? 'Actualizando...' : (!puedeActualizar ? 'Espera para actualizar' : 'Actualizar clima')}
      </button>
    </div>
  );
}

export default WidgetClima;
