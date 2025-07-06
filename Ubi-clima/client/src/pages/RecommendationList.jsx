import React, { useState, useEffect } from 'react';
import '../assets/RecommendationsList.css';

function RecommendationList() {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    temperatura: '',
    viento: '',
    lluvia: '',
    uv: '',
    outdoor: 0,
    indoor: 0,
    intellectual: 0,
    sports: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar recomendaciones al montar el componente
  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Función para obtener recomendaciones
  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/recomendaciones`);
      if (!response.ok) throw new Error('Error al cargar recomendaciones');
      const data = await response.json();
      setRecomendaciones(data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = isEditing 
        ? `http://localhost:3000/editar_recomendacion/${currentId}`
        : 'http://localhost:3000/guardar_recomendacion';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          temperatura: formData.temperatura ? Number(formData.temperatura) : null,
          viento: formData.viento ? Number(formData.viento) : null,
          lluvia: formData.lluvia ? Number(formData.lluvia) : null,
          uv: formData.uv ? Number(formData.uv) : null,
          outdoor: Number(formData.outdoor),
          indoor: Number(formData.indoor),
          intellectual: Number(formData.intellectual),
          sports: Number(formData.sports)
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error en el servidor');
      }

      alert(result.message);
      resetForm();
      fetchRecommendations();

    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (recomendacion) => {
    setFormData({
      nombre: recomendacion.nombre,
      descripcion: recomendacion.descripcion,
      temperatura: recomendacion.temperatura || '',
      viento: recomendacion.viento || '',
      lluvia: recomendacion.lluvia || '',
      uv: recomendacion.uv || '',
      outdoor: recomendacion.outdoor || 0,
      indoor: recomendacion.indoor || 0,
      intellectual: recomendacion.intellectual || 0,
      sports: recomendacion.sports || 0
    });
    setCurrentId(recomendacion.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
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

      alert(result.message);
      fetchRecommendations();
      
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      temperatura: '',
      viento: '',
      lluvia: '',
      uv: '',
      outdoor: 0,
      indoor: 0,
      intellectual: 0,
      sports: 0
    });
    setCurrentId(null);
    setIsEditing(false);
  };

  return (
    <div className="recommendation-container">
      <h2>{isEditing ? 'Editar Recomendación' : 'Agregar Nueva Recomendación'}</h2>
      <p className="description">
        Gestiona las recomendaciones genéricas disponibles para todos los usuarios.
      </p>
      <form onSubmit={handleSubmit} className="recommendation-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre*</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción*</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Temperatura ideal (°C)</label>
            <input
              type="number"
              name="temperatura"
              value={formData.temperatura}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Viento máximo (km/h)</label>
            <input
              type="number"
              name="viento"
              value={formData.viento}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Lluvia máxima (mm)</label>
            <input
              type="number"
              name="lluvia"
              value={formData.lluvia}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Índice UV máximo</label>
            <input
              type="number"
              name="uv"
              value={formData.uv}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Procesando...' : isEditing ? 'Actualizar' : 'Guardar'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} disabled={isLoading}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="recommendation-list">
        <h3>Recomendaciones Existentes</h3>
        {isLoading ? (
          <div className="loading">Cargando recomendaciones...</div>
        ) : recomendaciones.length === 0 ? (
          <div className="no-results">No se encontraron recomendaciones</div>
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
                <div className="card-actions">
                  <button onClick={() => handleEdit(rec)}>Editar</button>
                  <button onClick={() => handleDelete(rec.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendationList;
