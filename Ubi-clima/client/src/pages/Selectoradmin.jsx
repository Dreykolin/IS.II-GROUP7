import '../assets/selectoradmin.css';
import { useState, useEffect } from 'react';

export default function SelectorAdmin() {
  // Estados para los sliders de preferencias
  const [preferencias, setPreferencias] = useState({
    outdoor: 3,
    indoor: 3,
    sports: 3,
    intellectual: 3,
  });

  // Estado para el formulario de recomendación
  const [formRecomendacion, setFormRecomendacion] = useState({
    nombre: '',
    descripcion: '',
    temperatura: '',
    viento: '',
    lluvia: '',
    uv: ''
  });

  // Estado para las recomendaciones guardadas
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      // Cargar preferencias del usuario
      const usuario_id = localStorage.getItem('usuario_id');
      if (usuario_id) {
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
      }

      // Cargar todas las recomendaciones
      const resRec = await fetch('http://localhost:3000/recomendaciones');
      const recData = await resRec.json();
      setRecomendaciones(Array.isArray(recData) ? recData : []);

    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en los sliders
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

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormRecomendacion(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Preparar formulario para edición
  const prepararEdicion = (recomendacion) => {
    setFormRecomendacion({
      nombre: recomendacion.nombre,
      descripcion: recomendacion.descripcion,
      temperatura: recomendacion.temperatura || '',
      viento: recomendacion.viento || '',
      lluvia: recomendacion.lluvia || '',
      uv: recomendacion.uv || ''
    });
    setModoEdicion(true);
    setIdEdicion(recomendacion.id);
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setFormRecomendacion({
      nombre: '',
      descripcion: '',
      temperatura: '',
      viento: '',
      lluvia: '',
      uv: ''
    });
    setModoEdicion(false);
    setIdEdicion(null);
  };

  // Guardar o actualizar recomendación
  const guardarRecomendacion = async (e) => {
    e.preventDefault();
    const { nombre, descripcion } = formRecomendacion;

    if (!nombre.trim() || !descripcion.trim()) {
      setError('Nombre y descripción son obligatorios');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const actividad = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        temperatura: formRecomendacion.temperatura || null,
        viento: formRecomendacion.viento || null,
        lluvia: formRecomendacion.lluvia || null,
        uv: formRecomendacion.uv || null,
        outdoor: preferencias.outdoor,
        indoor: preferencias.indoor,
        sports: preferencias.sports,
        intellectual: preferencias.intellectual,
        usuario_id: null
      };

      let url = 'http://localhost:3000/guardar_recomendacion';
      let method = 'POST';
      
      if (modoEdicion) {
        url = `http://localhost:3000/editar_recomendacion/${idEdicion}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(actividad)
      });

      // Verificar si la respuesta es JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Respuesta inesperada: ${text.substring(0, 100)}...`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
      }

      // Actualizar lista de recomendaciones
      if (modoEdicion) {
        setRecomendaciones(prev => prev.map(item => 
          item.id === idEdicion ? { ...item, ...actividad } : item
        ));
      } else {
        setRecomendaciones(prev => [...prev, data]);
      }

      // Resetear formulario
      cancelarEdicion();

    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar recomendación
  const eliminarRecomendacion = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta recomendación?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/eliminar_recomendacion/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al eliminar');
      }

      // Actualizar la lista eliminando el item
      setRecomendaciones(prev => prev.filter(r => r.id !== id));
      
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="admin-container">
      <h2>Administrar recomendaciones en base a posibles Preferencias</h2>
      <p className="description">
        Configura los parámetros de preferencias y gestiona las recomendaciones disponibles para los usuarios con gustos específicos.
      </p>

      <div className="preference-section">
        <h3>Configuración de Preferencias</h3>
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
      </div>

      <div className="recommendation-form-section">
        <h3>{modoEdicion ? 'Editar Recomendación' : 'Crear Nueva Recomendación'}</h3>
        <form onSubmit={guardarRecomendacion} className="recommendation-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre*"
                value={formRecomendacion.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción*"
                value={formRecomendacion.descripcion}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="number"
                name="temperatura"
                placeholder="Temperatura ideal (°C)"
                value={formRecomendacion.temperatura}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="viento"
                placeholder="Viento máximo (km/h)"
                value={formRecomendacion.viento}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="number"
                name="lluvia"
                placeholder="Lluvia máxima (mm)"
                value={formRecomendacion.lluvia}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="uv"
                placeholder="Índice UV máximo"
                value={formRecomendacion.uv}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading 
                ? (modoEdicion ? 'Actualizando...' : 'Guardando...') 
                : (modoEdicion ? 'Actualizar Recomendación' : 'Guardar Recomendación')
              }
            </button>
            {modoEdicion && (
              <button 
                type="button" 
                onClick={cancelarEdicion}
                className="cancel-btn"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="recommendation-list-section">
        <h3>Recomendaciones Existentes</h3>
        
        {isLoading ? (
          <div className="loading">Cargando recomendaciones...</div>
        ) : recomendaciones.length === 0 ? (
          <div className="no-results">No hay recomendaciones guardadas</div>
        ) : (
          <div className="recommendation-grid">
            {recomendaciones.map((rec) => (
              <div key={rec.id} className="recommendation-card">
                <h4>{rec.nombre}</h4>
                <p>{rec.descripcion}</p>
                
                <div className="weather-conditions">
                  {rec.temperatura && <span>🌡️ {rec.temperatura}°C</span>}
                  {rec.viento && <span>💨 {rec.viento} km/h</span>}
                  {rec.lluvia && <span>🌧️ {rec.lluvia} mm</span>}
                  {rec.uv && <span>☀️ UV {rec.uv}</span>}
                </div>
                
                <div className="preference-scores">
                  <span>🏞️ Outdoor: {rec.outdoor}/5</span>
                  <span>🏠 Indoor: {rec.indoor}/5</span>
                  <span>⚽ Sports: {rec.sports}/5</span>
                  <span>🧠 Intellectual: {rec.intellectual}/5</span>
                </div>
                
                <div className="card-actions">
                  <button 
                    onClick={() => prepararEdicion(rec)}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => eliminarRecomendacion(rec.id)}
                    className="delete-btn"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}