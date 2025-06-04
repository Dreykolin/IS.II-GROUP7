import React from 'react';
import { useClima } from '../../context/ClimaContext';

function Pronostico() {
  const { pronostico, datosClima } = useClima();

  if (!pronostico || pronostico.length === 0) {
    return <p>No hay pronóstico disponible.</p>;
  }

  const ciudad = datosClima?.ciudad || 'tu ubicación';

  return (
    <section className="pronostico-container">
      <h1>Pronóstico para {ciudad}</h1>
      <div className="dias-pronostico">
        {pronostico.map((dia) => (
          <div key={dia.fecha} className="dia-card">
            <h3>{dia.fecha}</h3>
            <img
              src={`https://openweathermap.org/img/wn/${dia.icono}@2x.png`}
              alt={dia.descripcion}
              className="icono-clima"
            />
            <p>{dia.descripcion}</p>
            <p><strong>Max:</strong> {dia.temp_max}°C</p>
            <p><strong>Min:</strong> {dia.temp_min}°C</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pronostico;
