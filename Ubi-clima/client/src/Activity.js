class Activity{
    id;
    name;
    description;
    temperature;    //celsius
    wind_speed;     //km/h
    rain;           //mm
    uv;             //index

    //Gustos del usuario
    outdoor;
    indoor;
    intellectual;
    sports;
  
    editing_mode = 0;
  
    constructor(name, description, temperature, wind_speed, rain, uv, out_req, in_req, int_req, sp_req){

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

        if(!out_req){this.outdoor_req = 1}
        else{this.outdoor_req = out_req;}

        if(!in_req){this.indoor_req = 1}
        else{this.indoor_req = in_req;}

        if(!int_req){this.intellectual_req = 1}
        else{this.intellectual_req = int_req;}

        if(!sp_req){this.sports_req = 1}
        else{this.sports_req = sp_req;}
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

export default Activity;
