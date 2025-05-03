import { useState, useEffect } from 'react';
import { defaultActivities } from '../defaultActivities.js';
import Activity from '../Activity.js';

// Componente principal de Actividades
function Activities() {
  // ===== ESTADOS =====
  const [ubicacion, setUbicacion] = useState('');
  const [clima, setClima] = useState({
    temperatura: null,
    viento: null,
    tiempo_id: null
  });
  const [activities, setActivities] = useState([]);
  const [adminActivities, setAdminActivities] = useState([]); // Estado para actividades del admin
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user_preferences, setPreferences] = useState({
    outdoor: 3,
    indoor: 3,
    sports: 3,
    intellectual: 3
  });

  // ===== EFECTOS =====
  // Cargar actividades del usuario y obtener clima automáticamente al inicio
  useEffect(() => {
    loadUserActivities();
    loadAdminActivities(); // Cargar actividades del admin
    obtenerUbicacion(); // Llamada automática a la función de obtención de clima
  }, []);

  // Actualizar recomendaciones cuando cambia el clima o preferencias
  useEffect(() => {
    if (clima.temperatura !== null) {
      fetchRecomendaciones();
    }
  }, [clima, user_preferences]);

  // ===== FUNCIONES DE DATOS =====
  // Cargar actividades del usuario
  const loadUserActivities = async () => {
    const usuario_id = localStorage.getItem('usuario_id');
    if (!usuario_id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/actividades/${usuario_id}`);
      const data = await res.json();
      setActivities(data);
    } catch (error) {
      console.error("Error al obtener actividades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar actividades del admin (donde usuario_id es null)
  const loadAdminActivities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/admin`);
      const data = await res.json();
      setAdminActivities(data);
    } catch (error) {
      console.error("Error al obtener actividades del admin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener ubicación y clima
  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setUbicacion("La geolocalización no es compatible.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => getWeatherData(position),
      (error) => {
        setUbicacion(`Error: ${error.message}`);
        setIsLoading(false);
      }
    );
  };

  // Obtener datos del clima
  const getWeatherData = async (position) => {
    const latitud = position.coords.latitude;
    const longitud = position.coords.longitude;
    setUbicacion(`Latitud: ${latitud}, Longitud: ${longitud}`);

    try {
      const climaRes = await fetch('http://localhost:3000/clima', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: latitud, lon: longitud })
      });

      const datosClima = await climaRes.json();
      setClima({
        temperatura: datosClima.temperatura,
        viento: datosClima.viento,
        tiempo_id: datosClima.tiempo_id
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener recomendaciones basadas en clima y preferencias
  const fetchRecomendaciones = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          temperatura: clima.temperatura, 
          viento: clima.viento, 
          tiempo_id: clima.tiempo_id, 
          preferencias: user_preferences 
        })
      });
      const data = await res.json();
      setRecomendaciones(data);
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ===== MANIPULACIÓN DE ACTIVIDADES =====
  // Crear nueva actividad
  const createActivity = async () => {
    const getValue = id => document.getElementById(id).value;
    const usuario_id = localStorage.getItem('usuario_id');

    // Validación básica
    if (!getValue("name")) {
      alert("El nombre es obligatorio");
      return;
    }

    const body = {
      nombre: getValue("name"),
      descripcion: getValue("description"),
      temperatura: Number(getValue("temperature")),
      viento: Number(getValue("wind_speed")),
      lluvia: Number(getValue("rain")),
      uv: Number(getValue("uv")),
      ...user_preferences,
      usuario_id
    };

    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:3000/guardar_actividad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const msg = await res.text();
        alert("✅ Actividad guardada correctamente: " + msg);
        setActivities([...activities, body]);
        
        // Limpiar formulario
        document.getElementById("name").value = "";
        document.getElementById("description").value = "";
        document.getElementById("temperature").value = "";
        document.getElementById("wind_speed").value = "";
        document.getElementById("rain").value = "";
        document.getElementById("uv").value = "";
      } else {
        const error = await res.json();
        alert("❌ Error: " + error.error);
      }
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      alert("Error de red");
    } finally {
      setIsLoading(false);
    }
  };

  // Modificar actividad existente
  const modifyActivity = (index) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = {
      ...updatedActivities[index],
      nombre: document.getElementById("edit_name").value,
      descripcion: document.getElementById("edit_description").value,
      temperatura: Number(document.getElementById("edit_temperature").value),
      viento: Number(document.getElementById("edit_wind_speed").value),
      lluvia: Number(document.getElementById("edit_rain").value),
      uv: Number(document.getElementById("edit_uv").value),
    };
    setActivities(updatedActivities);
  };

  // Eliminar actividad
  const deleteActivity = (index) => {
    if (window.confirm("¿Estás seguro de eliminar esta actividad?")) {
      setActivities(activities => activities.filter((_, i) => i !== index));
    }
  };

  // Toggle modo edición
  const toggleEditMode = (index) => {
    const updated = [...activities];
    updated[index].editing_mode = !updated[index].editing_mode;
    setActivities(updated);
  };

  // Agregar actividad recomendada a la lista personal
  const addRecommendedActivity = (index) => {
    const actividad = recomendaciones.actividades[index];
    const new_activity = new Activity(
      actividad.nombre,
      actividad.descripcion,
      actividad.temperatura,
      actividad.viento,
      actividad.lluvia,
      actividad.uv
    );
    setActivities([...activities, new_activity]);
    alert(`"${actividad.nombre}" agregada a tus actividades personalizadas`);
  };

  // Agregar actividad del admin a la lista personal
  const addAdminActivity = (index) => {
    const actividad = adminActivities[index];
    const new_activity = new Activity(
      actividad.nombre,
      actividad.descripcion,
      actividad.temperatura,
      actividad.viento,
      actividad.lluvia,
      actividad.uv
    );
    setActivities([...activities, new_activity]);
    alert(`"${actividad.nombre}" agregada a tus actividades personalizadas`);
  };

  // ===== COMPONENTES DE INTERFAZ =====
  // Componente para gestionar preferencias de usuario
  const PreferenceSelector = () => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setPreferences(prev => ({ ...prev, [name]: Number(value) }));
    };

    return (
      <div>
        <h1>Define tus gustos</h1>
        <p>Del 1 al 5, califica las siguientes categorías según cuánto te gustan.</p>
        {Object.entries(user_preferences).map(([key, value]) => (
          <div key={key}>
            <p>{key}</p>
            <input
              type="range"
              min="1"
              max="5"
              name={key}
              value={value}
              onChange={handleChange}
            />
            <p>Valor: {value}</p>
          </div>
        ))}
      </div>
    );
  };

  // Componente para mostrar recomendaciones
  const RecommendationsList = () => (
    <div>
      <h1>Algunas actividades que podrían interesarte</h1>
      <h4>Según el clima local y tus gustos</h4>
      {isLoading ? (
        <p>Cargando recomendaciones...</p>
      ) : recomendaciones?.actividades?.length > 0 ? (
        recomendaciones.actividades.map((item, index) => (
          <div key={index}>
            <h3>{item.nombre}</h3>
            <p>{item.descripcion}</p>
            <button onClick={() => addRecommendedActivity(index)}>
              Agregar a Actividades personalizadas
            </button>
          </div>
        ))
      ) : (
        <p>No hay actividades que coincidan con tus preferencias</p>
      )}
    </div>
  );

  // Componente para mostrar actividades del administrador
  const AdminActivitiesList = () => (
    <div>
      <h1>Actividades Recomendadas por el Administrador</h1>
      {isLoading ? (
        <p>Cargando actividades del administrador...</p>
      ) : adminActivities.length > 0 ? (
        adminActivities.map((item, index) => (
          <div key={index}>
            <h3>{item.nombre}</h3>
            <p>{item.descripcion}</p>
            <p>Temperatura ideal: {item.temperatura}°C</p>
            <p>Viento ideal: {item.viento} m/s</p>
            <p>Lluvia: {item.lluvia} mm</p>
            <p>Índice UV: {item.uv}</p>
            <button onClick={() => addAdminActivity(index)}>
              Agregar a mis actividades
            </button>
          </div>
        ))
      ) : (
        <p>No hay actividades del administrador disponibles</p>
      )}
    </div>
  );

  // Componente para mostrar lista de actividades personales
  const ActivityList = () => (
    <div>
      <h1>Lista de Actividades</h1>
      {isLoading ? (
        <p>Cargando actividades...</p>
      ) : activities.length > 0 ? (
        activities.map((item, index) => (
          <div key={index}>
            {item.editing_mode ? (
              // Modo edición
              <div>
                <input id="edit_name" defaultValue={item.nombre} />
                <textarea id="edit_description" defaultValue={item.descripcion} />
                <input id="edit_temperature" type="number" defaultValue={item.temperatura} />
                <input id="edit_wind_speed" type="number" defaultValue={item.viento} />
                <input id="edit_rain" type="number" defaultValue={item.lluvia} />
                <input id="edit_uv" type="number" defaultValue={item.uv} />
                <button onClick={() => modifyActivity(index)}>Guardar cambios</button>
                <button onClick={() => toggleEditMode(index)}>Cancelar</button>
              </div>
            ) : (
              // Modo visualización
              <div>
                <h2>{item.nombre}</h2>
                <p>{item.descripcion}</p>
                <p>Temperatura ideal: {item.temperatura}°C</p>
                <p>Viento ideal: {item.viento} m/s</p>
                <p>Lluvia: {item.lluvia} mm</p>
                <p>Índice UV: {item.uv}</p>
                <button onClick={() => toggleEditMode(index)}>Editar</button>
                <button onClick={() => deleteActivity(index)}>Eliminar</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No tienes actividades guardadas</p>
      )}
      <p>Total: {activities.length} actividades</p>
    </div>
  );

  // Componente para crear nuevas actividades
  const ActivityForm = () => (
    <div>
      <h1>Crear Actividad</h1>
      <div>
        <p>Nombre*</p>
        <input id="name" placeholder="Nombre de la actividad" />

        <p>Descripción</p>
        <textarea id="description" placeholder="Describe la actividad..." />

        <p>Temperatura ideal (°C)</p>
        <input id="temperature" type="number" placeholder="25" />

        <p>Velocidad ideal del viento (m/s)</p>
        <input id="wind_speed" type="number" placeholder="5" />

        <p>Lluvia (mm)</p>
        <input id="rain" type="number" placeholder="0" />

        <p>Índice UV</p>
        <input id="uv" type="number" placeholder="5" />

        <button onClick={createActivity} disabled={isLoading}>
          {isLoading ? "Guardando..." : "Crear actividad"}
        </button>
      </div>
    </div>
  );

  // Componente para mostrar información del clima
  const WeatherInfo = () => (
    <div>
      <h1>Información del clima</h1>
      <p>{ubicacion || "Obteniendo ubicación automáticamente..."}</p>
      {clima.temperatura !== null ? (
        <>
          <p>Temperatura: {clima.temperatura}°C</p>
          <p>Viento: {clima.viento} m/s</p>
        </>
      ) : (
        <p>{isLoading ? "Cargando datos del clima..." : "Datos del clima no disponibles"}</p>
      )}
    </div>
  );

  // ===== RENDERIZADO PRINCIPAL =====
  return (
    <div>
      <WeatherInfo />
      <PreferenceSelector />
      <ActivityList />
      <AdminActivitiesList />
      <RecommendationsList />
      <ActivityForm />
    </div>
  );
}

export default Activities;
