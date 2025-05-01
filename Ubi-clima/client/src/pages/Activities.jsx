import { act, useState } from 'react';
import { defaultActivities } from '../defaultActivities.js';
import Activity from '../Activity.js';

class UserPreferences{
  outdoor_activities;
  indoor_activities;
  sports;
  intellectual_activities;

  constructor(){
    this.outdoor_activities = 3;
    this.indoor_activities = 3;
    this.sports = 3;
    this.intellectual_activities = 3;
  }
}

function App() {

  const [ubicacion, setUbicacion] = useState('');

  /*
  0 = temperatura
  1 = velocidad viento
  2 = tiempo id
   */
  const [clima, setClima] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [recommended_activities, setRecommendedActivities] = useState(defaultActivities);

  const usp = new UserPreferences();

  const [user_preferences, setPreferences] = useState(usp);
  /*
  range 0-10
  0 - essential activities
  1 = outdoor activities preference
  2 - indoor activities preference
  3 - intellectual activities
  4 - sports
  */

  /*
  const outdoor_value = document.getElementById("outdoor").value;
  const indoor_value = document.getElementById("indoor").value;
  const intellectual_value = document.getElementById("intellectual").value;
  const sports_value = document.getElementById("sports").value;
  */


  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setUbicacion("La geolocalización no es compatible.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitud = position.coords.latitude;
      const longitud = position.coords.longitude;
      setUbicacion(`Latitud: ${latitud}, Longitud: ${longitud}`);

      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`);
        const geoData = await geoRes.json();
        const ciudad = geoData.address?.city || "Ciudad no encontrada";

        await fetch('http://localhost:3000/guardar_ubicacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitud, longitud, ciudad })
        });

        const climaRes = await fetch('http://localhost:3000/clima', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: latitud, lon: longitud })
        });

        const datosClima = await climaRes.json();
        setClima([datosClima.temperatura, datosClima.viento, datosClima.tiempo_id]);
      } catch (err) {
        console.error(err);
      }
    });
  };

  obtenerUbicacion();
  
  const CreateActivity = () => {
    const n = document.getElementById("name").value;
    const d = document.getElementById("description").value;
    const t = document.getElementById("temperature").value;
    const w = document.getElementById("wind_speed").value;
    const r = document.getElementById("rain").value;
    const u = document.getElementById("uv").value;
    const new_activity = new Activity(n, d, t, w, r, u);
    setActivities([...activities, new_activity]);
  }

  const ModifyActivity = (index) => {
    
    const n = document.getElementById("edit_name").value;
    const d = document.getElementById("edit_description").value;
    const t = document.getElementById("edit_temperature").value;
    const w = document.getElementById("edit_wind_speed").value;
    const r = document.getElementById("edit_rain").value;
    const u = document.getElementById("edit_uv").value;
    
    const updatedActivities = [...activities];
    updatedActivities[index] = {
      name: n,
      description: d,
      temperature: t,
      wind_speed: w,
      rain: r,
      uv: u,
    };

    setActivities(updatedActivities);
  }

  const DeleteActivity = (index) => {

    if (index > -1) { 
      setActivities(activities => activities.filter((_, i) => i !== index));
    }
    ShowActivities();
  }

  const toggleEditMode = (index) => {
    const updated = [...activities];
    updated[index].editing_mode = !updated[index].editing_mode;
    setActivities(updated);
  };

  const AskPreferences = () => {

    //esta función cambia user_preferences con el evento lanzado por react al cambiar los sliders
    const handleChange = (e) => {
      const { name, value } = e.target;
      setPreferences(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    };

    return(
      <div>
        <p>Actividades al aire libre</p>
        <input type="range" min="1" max="5" defaultValue={user_preferences.outdoor_activities} name="outdoor_activities" className="slider" onChange={handleChange}></input>
        <p>Value: {user_preferences.outdoor_activities}</p>

        <p>Actividades dentro de casa</p>
        <input type="range" min="1" max="5" defaultValue={user_preferences.indoor_activities}  name="indoor_activities" className="slider" onChange={handleChange}></input>
        <p>Value: {user_preferences.indoor_activities}</p>

        <p>Actividades intelectuales</p>
        <input type="range" min="1" max="5" defaultValue={user_preferences.intellectual_activities} name="intellectual_activities" className="slider" onChange={handleChange}></input>
        <p>Value: {user_preferences.intellectual_activities}</p>

        <p>Deportes</p>
        <input type="range" min="1" max="5" defaultValue={user_preferences.sports} name="sports" className="slider" id="sports" onChange={handleChange}></input>
        <p>Value: {user_preferences.sports}</p>


      </div>
    )
  }

  const ShowRecommendations = () => {
    const filteredActivities = recommended_activities.filter(activity => {
      // Comparamos requisitos con las preferencias del usuario
      return (
        activity.outdoor_req <= user_preferences.outdoor_activities &&
        activity.indoor_req <= user_preferences.indoor_activities &&
        activity.intellectual_req <= user_preferences.intellectual_activities &&
        activity.sports_req <= user_preferences.sports &&
        clima[0] <= activity.temperature &&
        clima[1] <= activity.wind_speed 
        //&& clima[2] == activity.RainInMM
      );
    });
  
    return (
      <div>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((item, index) => (
            <div key={index}>
              <p>{item.name}</p>
              <p>{item.description}</p>
              <button onClick={() => AddRecommendedActivity(index)}>Agregar a Actividades personalizadas</button>
            </div>
          ))
        ) : (
          <p>No hay actividades que coincidan con tus preferencias</p>
        )}
      </div>
    );
  };

  const AddRecommendedActivity = (index) => {
    const n = recommended_activities[index].name;
    const d = recommended_activities[index].description;
    const t = recommended_activities[index].temperature;
    const w = recommended_activities[index].wind_speed;
    const r = recommended_activities[index].rain;
    const u = recommended_activities[index].uv;
    const new_activity = new Activity(n, d, t, w, r, u);
    setActivities([...activities, new_activity]);
  }

  const ShowActivities = () => {
    return (
      <div>
        {activities.map((item, index) => (
          !item.editing_mode ? (
            <div key={index}>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>Temperatura ideal: {item.temperature}</p>
              <p>Viento ideal: {item.wind_speed}</p>
              <p>Lluvia: {item.rain}</p>
              <p>Índice UV: {item.uv}</p>
              {isAdmin && (
              <>
                <button onClick={() => DeleteActivity(index)}>Borrar actividad</button>
                <button onClick={() => toggleEditMode(index)}>Editar</button>
              </>
            )}
            </div>
          ) : (
            <div key={index}>
              <p>Nombre nuevo</p>
              <input id="edit_name" defaultValue={item.name} />
              <p>Descripción nueva</p>
              <input id="edit_description" defaultValue={item.description} />
              <p>Temperatura ideal (°C)</p>
              <input id="edit_temperature" defaultValue={item.temperature} />
              <p>Viento ideal (km/h)</p>
              <input id="edit_wind_speed" defaultValue={item.wind_speed} />
              <p>Lluvia (mm)</p>
              <input id="edit_rain" defaultValue={item.rain} />
              <p>Índice UV</p>
              <input id="edit_uv" defaultValue={item.uv} />
              <button onClick={() => ModifyActivity(index)}>Guardar cambios</button>
              <button onClick={() => toggleEditMode(index)}>Cancelar</button>
            </div>
          )
        ))}
      </div>
    );
  };

    return (
    <div>

      <p>T: {clima[0]}°C </p>
      <p>Viento: {clima[1]}m/s </p>

      <button className="btn btn-primary rounded shadow px-4 py-2" onClick={obtenerUbicacion}>
            Buscar
      </button>

      <h1>Define tus gustos</h1>
      <p>Del 1 al 5, califica las siguientes categorias según cuánto te gustan.</p>
      
      <AskPreferences />

      <button onClick={() => setIsAdmin(!isAdmin)} style={{ marginBottom: "20px" }}>
      {isAdmin ? "Salir del modo Administrador" : "Entrar como Administrador"}
      </button>

      <h1>Lista de Actividades</h1>
      <ShowActivities />
      <p>Existen {activities.length} actividades ahora mismo.</p>
      
      <h1>Algunas actividades que podrían interesarte.</h1>
      <h4>Según el clima local y tus gustos</h4>
      <ShowRecommendations />

      <h1>Crear Actividades</h1>
      <div>

      <p>Nombre</p>
      <input id="name"></input>
      <br></br>

      <p>Descripción</p>
      <input id="description"></input>
      <br></br>

      <p>Temperatura ideal (°C)</p>
      <input id="temperature"></input>
      <br></br>

      <p>Velocidad ideal del viento (km/h)</p>
      <input id="wind_speed"></input>
      <br></br>

      <p>Lluvia (mm)</p>
      <input id="rain"></input>
      <br></br>

      <p>Índice UV</p>
      <input id="uv"></input>
      <br></br>

      <button onClick={CreateActivity}>Crear actividad</button>

      </div>


    </div>  
  );
}

export default App;
