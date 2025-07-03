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
  const [filters, setFilters] = useState({
    temperatura: '',
    viento: '',
    lluvia: '',
    uv: ''
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
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '') queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:3000/recomendaciones?${queryParams}`);
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

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Aplicar filtros
  const applyFilters = () => {
    fetchRecommendations();
  };

  // Resetear filtros
  const resetFilters = () => {
    setFilters({
      temperatura: '',
      viento: '',
      lluvia: '',
      uv: ''
    });
    fetchRecommendations();
  };

  // Enviar formulario (crear o actualizar)
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
          // Convertir valores numéricos
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

  // Editar recomendación
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

  // Eliminar recomendación
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

  // Resetear formulario
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
      
      {/* Formulario de recomendación */}
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

      {/* Filtros de búsqueda */}
      <div className="filters-section">
        <h3>Filtrar Recomendaciones</h3>
        <div className="filter-row">
          <div className="filter-group">
            <label>Temperatura (°C)</label>
            <input
              type="number"
              name="temperatura"
              value={filters.temperatura}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label>Viento (km/h)</label>
            <input
              type="number"
              name="viento"
              value={filters.viento}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label>Lluvia (mm)</label>
            <input
              type="number"
              name="lluvia"
              value={filters.lluvia}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label>Índice UV</label>
            <input
              type="number"
              name="uv"
              value={filters.uv}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="filter-actions">
          <button onClick={applyFilters} disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Aplicar Filtros'}
          </button>
          <button onClick={resetFilters} disabled={isLoading}>
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && <div className="error-message">{error}</div>}

      {/* Lista de recomendaciones */}
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