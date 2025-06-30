    import React, { useState } from 'react';
    import '../assets/RecommendationsList.css';

    function RecommendationList({ recomendaciones, setRecomendaciones }) {
      const [nuevaActividad, setNuevaActividad] = useState({
        nombre: '',
        descripcion: '',
        temperatura: '',
        viento: '',
        lluvia: '',
        uv: '',
      });

      const handleChange = (e) => {
        setNuevaActividad({
          ...nuevaActividad,
          [e.target.name]: e.target.value
        });
      };

      const handleAddManual = async (e) => {
        e.preventDefault();

        const nueva = {
          ...nuevaActividad,
          temperatura: parseFloat(nuevaActividad.temperatura) || 0,
          viento: parseFloat(nuevaActividad.viento) || 0,
          lluvia: parseFloat(nuevaActividad.lluvia) || 0,
          uv: parseFloat(nuevaActividad.uv) || 0,
        };

        if (nueva.nombre && nueva.descripcion) {
          try {
            const response = await fetch('http://localhost:3000/guardar_recomendacion', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(nueva)
            });

            const mensaje = await response.text();
            console.log(mensaje);
            alert("Recomendación guardada correctamente.");

            setRecomendaciones([...recomendaciones, nueva]);

            setNuevaActividad({
              nombre: '',
              descripcion: '',
              temperatura: '',
              viento: '',
              lluvia: '',
              uv: '',
            });
          } catch (error) {
            console.error("Error al guardar la recomendación:", error);
            alert("Hubo un error al guardar la recomendación.");
          }
        }
      };

      return (
        <div className="recommendation-container">
          <h3>Recomendaciones Manuales</h3>
          <form onSubmit={handleAddManual} className="recommendation-form">
            <input type="text" name="nombre" placeholder="Nombre" value={nuevaActividad.nombre} onChange={handleChange} required />
            <input type="text" name="descripcion" placeholder="Descripción" value={nuevaActividad.descripcion} onChange={handleChange} required />
            <input type="number" name="temperatura" placeholder="Temperatura" value={nuevaActividad.temperatura} onChange={handleChange} />
            <input type="number" name="viento" placeholder="Viento ideal" value={nuevaActividad.viento} onChange={handleChange} />
            <input type="number" name="lluvia" placeholder="Lluvia" value={nuevaActividad.lluvia} onChange={handleChange} />
            <input type="number" name="uv" placeholder="Índice UV" value={nuevaActividad.uv} onChange={handleChange} />
            <button type="submit">Agregar Recomendación</button>
          </form>

          <ul className="recommendation-list">
            {recomendaciones?.map((rec, index) => (
              <li key={index} className="recommendation-item">
                <strong>{rec.nombre}</strong> - {rec.descripcion}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    export default RecommendationList;