import { act, useState } from 'react';
import { defaultActivities } from './defaultActivities.js';
import Activity from './Activity.js';

function App() {

  const [activities, setActivities] = useState([]);
  const [recommended_activities, setRecommendedActivities] = useState(defaultActivities);

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

  const ShowRecommendations = () => {
    return(
      <div>
        {recommended_activities.map((item, index) => (
            <div key={index}>
              <p>{item.name}</p>
              <button onClick={() => AddRecommendedActivity(index)}>Agregar a Actividades personalizadas</button>
            </div>
          )
        )}
      </div>
    )
  }

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
              <button onClick={() => DeleteActivity(index)}>Borrar actividad</button>
              <button onClick={() => toggleEditMode(index)}>Editar</button>
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
      <h1>Lista de Actividades</h1>
      <ShowActivities />
      <p>Existen {activities.length} actividades ahora mismo</p>
      
      <h1>Algunas actividades que podrían interesarte</h1>
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
