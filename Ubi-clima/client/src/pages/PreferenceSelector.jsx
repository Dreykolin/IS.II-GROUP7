import '../assets/PreferenceSelector.css';
import { useState } from 'react';

export default function PreferenceSelector() {
  const [preferencias, setPreferencias] = useState({
    outdoor: 3,
    indoor: 3,
    sports: 3,
    intellectual: 3,
  });

  const [nuevaPreferencia, setNuevaPreferencia] = useState({
    nombre: '',
    descripcion: '',
    temperatura: '',
    viento: '',
    lluvia: '',
    uv: '',
  });

  const [gustos, setGustos] = useState([]);

  const handleSliderChange = (e, key) => {
    setPreferencias((prev) => ({
      ...prev,
      [key]: parseInt(e.target.value),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaPreferencia((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarGusto = (e) => {
    e.preventDefault();
    const { nombre, descripcion } = nuevaPreferencia;

    if (!nombre.trim() || !descripcion.trim()) return;

    setGustos((prev) => [...prev, nuevaPreferencia]);
    setNuevaPreferencia({
      nombre: '',
      descripcion: '',
      temperatura: '',
      viento: '',
      lluvia: '',
      uv: '',
    });
  };

  return (
    <section className="preference-sliders">
      <h2>Define tus gustos</h2>
      <p className="description">
        Del 1 al 5, califica las siguientes categorías según cuánto te gustan.
      </p>

      <div className="sliders-container">
        {Object.entries(preferencias).map(([key, value]) => (
          <div className="slider-group" key={key}>
            <label>{key}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={value}
              onChange={(e) => handleSliderChange(e, key)}
            />
            <span>{value}</span>
          </div>
        ))}
      </div>

      <h3>Agregar preferencia personalizada</h3>
      <form onSubmit={agregarGusto} className="add-slider-form">
        <input name="nombre" placeholder="Nombre" value={nuevaPreferencia.nombre} onChange={handleInputChange} />
        <input name="descripcion" placeholder="Descripción" value={nuevaPreferencia.descripcion} onChange={handleInputChange} />
        <input name="temperatura" type="number" placeholder="Temperatura" value={nuevaPreferencia.temperatura} onChange={handleInputChange} />
        <input name="viento" type="number" placeholder="Viento" value={nuevaPreferencia.viento} onChange={handleInputChange} />
        <input name="lluvia" type="number" placeholder="Lluvia" value={nuevaPreferencia.lluvia} onChange={handleInputChange} />
        <input name="uv" type="number" placeholder="Índice UV" value={nuevaPreferencia.uv} onChange={handleInputChange} />
        <button type="submit">Agregar gusto</button>
      </form>

      {gustos.length > 0 && (
        <div className="recomendaciones-list">
          <h3>Gustos definidos</h3>
          <div className="recomendaciones-grid">
            {gustos.map((gusto, idx) => (
              <div className="recomendacion-card" key={idx}>
                <h4>{gusto.nombre}</h4>
                <p>{gusto.descripcion}</p>
                <ul>
                  <li>Temperatura: {gusto.temperatura}</li>
                  <li>Viento: {gusto.viento}</li>
                  <li>Lluvia: {gusto.lluvia}</li>
                  <li>UV: {gusto.uv}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
