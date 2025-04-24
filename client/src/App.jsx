import { act, useState } from 'react';


class Activity{
  name;
  description;
  temperature;    //celsius
  wind_speed;     //km/h
  rain;           //mm
  uv;             //index

  editing_mode = 0;

  constructor(name, description, temperature, wind_speed, rain, uv){
      if(!name){this.name = "New Activity";}
      else{this.name = name;}

      if(!description){this.description = "Activity description";}
      else{this.description = description;}

      this.temperature = temperature ?? 20;

      if(!wind_speed){this.wind_speed = 14.4;}
      else{this.wind_speed = wind_speed;}

      if(!rain){this.rain = 0;}
      else{this.rain = rain;}
      
      if(!uv){this.uv = 2;}
      else{this.uv = uv;}
  }

  get RainInInches(){
      return (this.rain/25);
  }
  get RainInMM(){
      return this.rain;
  }
  get TemperatureInC(){
      return temp;
  }
  get TemperatureInK(){
      return (this.temperature + 273.15);
  }
  get TemperatureInF(){
      return ((this.temperature * 9 /5) + 32);
  }
  get UVIndex(){
      return this.uv;
  }
  get WindSpeedInKm(){
      return this.wind_speed;
  }
  get WindSpeedInMph(){
      return this.wind_speed/1.609;
  }

  set RainInInches(rain){
      this.rain (this.rain*25);
  }
  set RainInMM(rain){
      this.rain = rain;
  }    
  set TemperatureInC(temp){
      this.temperature = temp;
  }
  set TemperatureInK(temp){
      this.temperature = temp - 273.15;
  }
  set TemperatureInF(temp){
      this.temperature = (temp -32) * 5 / 9;
  }
  set UVIndex(index){
      this.uv = index;
  }
  set WindSpeedInKm(ws){
      this.wind_speed = ws;
  }
  set WindSpeedInMph(ws){
      this.wind_speed = ws*1.609;
  }

}


function App() {

  const [activities, setActivities] = useState([]);

  const CreateActivity = () => {
    console.log("creando actividad");
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

  const ShowActivities = () => {
    return (
      <div>
        {activities.map((item, index) => (
          !item.editing_mode ? (
            <div key={index}>
              <h1>{item.name}</h1>
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
