import { useState, useEffect } from 'react';
import { useClima } from '../context/ClimaContext';
import '../assets/Widget_clima.css';

function WidgetClima() {
    const { datosClima, obtenerUbicacionYClima, puedeActualizar } = useClima();
    const [cargando, setCargando] = useState(false);
    const [climaTexto, setClimaTexto] = useState('');

    // ⬅️ 1. Nuevo estado para guardar la URL del ícono
    const [iconUrl, setIconUrl] = useState('');

    useEffect(() => {
        if (datosClima) {
            setClimaTexto(`${Math.round(datosClima.temperatura)}°C y ${datosClima.descripcion} en ${datosClima.ciudad}`);

            // ⬅️ 2. Construimos la URL del ícono si tenemos el código
            if (datosClima.icon) {
                setIconUrl(`https://openweathermap.org/img/wn/${datosClima.icon}@2x.png`);
            }

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
            {/* ⬅️ 3. Contenedor para alinear el ícono y el texto */}
            <div className="clima-info">
                {iconUrl && !cargando && <img src={iconUrl} alt={datosClima.descripcion} className="clima-icon" />}
                <p>{cargando ? 'Actualizando clima...' : climaTexto}</p>
            </div>
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