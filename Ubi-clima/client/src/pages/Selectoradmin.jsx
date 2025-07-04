import '../assets/selectoradmin.css';
import { useState, useEffect } from 'react';

export default function selectoradmin() {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar preferencias del usuario y gustos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      const usuario_id = localStorage.getItem('usuario_id');
      if (!usuario_id) return;

      try {
        // Cargar preferencias del usuario
        const resPref = await fetch(`http://localhost:3000/usuarios/preferencias/${usuario_id}`);
        if (resPref.ok) {
          const prefData = await resPref.json();
          if (prefData.success) {
            setPreferencias({
              outdoor: prefData.data.outdoor || 3,
              indoor: prefData.data.indoor || 3,
              sports: prefData.data.sports || 3,
              intellectual: prefData.data.intellectual || 3,
            });
          }
        }

        // Cargar actividades del usuario
        const resAct = await fetch(`http://localhost:3000/actividades/usuario/${usuario_id}`);
        if (resAct.ok) {
          const actData = await resAct.json();
          setGustos(actData.success ? actData.data : []);
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      }
    };

    cargarDatos();
  }, []);

  const handleSliderChange = (e, key) => {
    const value = parseInt(e.target.value);
    setPreferencias(prev => ({
      ...prev,
      [key]: value,
    }));

    // Actualizar preferencias en el servidor
    const usuario_id = localStorage.getItem('usuario_id');
    if (usuario_id) {
      fetch(`http://localhost:3000/usuarios/preferencias/${usuario_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      }).catch(err => console.error('Error al actualizar preferencias:', err));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaPreferencia(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarGusto = async (e) => {
    e.preventDefault();
    const { nombre, descripcion } = nuevaPreferencia;

    if (!nombre.trim() || !descripcion.trim()) {
      setError('Nombre y descripción son obligatorios');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const usuario_id = localStorage.getItem('usuario_id');
      const actividad = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        temperatura: nuevaPreferencia.temperatura || null,
        viento: nuevaPreferencia.viento || null,
        lluvia: nuevaPreferencia.lluvia || null,
        uv: nuevaPreferencia.uv || null,
        outdoor: preferencias.outdoor,
        indoor: preferencias.indoor,
        sports: preferencias.sports,
        intellectual: preferencias.intellectual,
        usuario_id: usuario_id ? parseInt(usuario_id) : null,
      };

      const res = await fetch('http://localhost:3000/guardar_actividad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actividad)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar la preferencia');
      }

      // Actualizar la lista de gustos
      setGustos(prev => [...prev, data]);
      setNuevaPreferencia({
        nombre: '',
        descripcion: '',
        temperatura: '',
        viento: '',
        lluvia: '',
        uv: '',
      });

    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="preference-sliders">
      <h2>Configurar parámetros de preferencias</h2>
      <p className="description">
        Este panel permite definir y guardar parámetros personalizados que luego estarán disponibles para los usuarios en la página principal.
      </p>

      <div className="sliders-container">
        {Object.entries(preferencias).map(([key, value]) => (
          <div className="slider-group" key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={value}
              onChange={(e) => handleSliderChange(e, key)}
              className="slider-input"
            />
            <div className="slider-value">{value}</div>
          </div>
        ))}
      </div>

      <h3>Agregar preferencia personalizada</h3>
      <form onSubmit={agregarGusto} className="add-slider-form">
        <div className="form-group">
          <input 
            name="nombre" 
            placeholder="Nombre*" 
            value={nuevaPreferencia.nombre} 
            onChange={handleInputChange} 
            required
          />
        </div>
        <div className="form-group">
          <input 
            name="descripcion" 
            placeholder="Descripción*" 
            value={nuevaPreferencia.descripcion} 
            onChange={handleInputChange} 
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <input 
              name="temperatura" 
              type="number" 
              placeholder="Temperatura ideal (°C)" 
              value={nuevaPreferencia.temperatura} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group">
            <input 
              name="viento" 
              type="number" 
              placeholder="Viento máximo (km/h)" 
              value={nuevaPreferencia.viento} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input 
              name="lluvia" 
              type="number" 
              placeholder="Lluvia máxima (mm)" 
              value={nuevaPreferencia.lluvia} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group">
            <input 
              name="uv" 
              type="number" 
              placeholder="Índice UV máximo" 
              value={nuevaPreferencia.uv} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Agregar gusto'}
        </button>
      </form>

      <div className="recomendaciones-list">
        <h3>Mis Preferencias Guardadas</h3>
        {gustos.length > 0 ? (
          <div className="recomendaciones-grid">
            {gustos.map((gusto) => (
              <div className="recomendacion-card" key={gusto.id}>
                <h4>{gusto.nombre}</h4>
                <p>{gusto.descripcion}</p>
                <ul>
                  {gusto.temperatura && <li>🌡️ Temperatura: {gusto.temperatura}°C</li>}
                  {gusto.viento && <li>💨 Viento: {gusto.viento} km/h</li>}
                  {gusto.lluvia && <li>🌧️ Lluvia: {gusto.lluvia} mm</li>}
                  {gusto.uv && <li>☀️ UV: {gusto.uv}</li>}
                  <li>🏞️ Outdoor: {gusto.outdoor}/5</li>
                  <li>🏠 Indoor: {gusto.indoor}/5</li>
                  <li>⚽ Sports: {gusto.sports}/5</li>
                  <li>🧠 Intellectual: {gusto.intellectual}/5</li>
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-gustos">No tienes preferencias guardadas aún.</p>
        )}
      </div>
    </section>
  );
}