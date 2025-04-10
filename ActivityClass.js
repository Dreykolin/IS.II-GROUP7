class Activity{
    name;
    description;
    temperature;    //celsius
    wind_speed;     //km/h
    rain;           //mm
    uv;             //index

    constructor(name, description, temperature, wind_speed, rain, uv){
        if(!name){this.name = "New Activity";}
        else{this.name = name;}

        if(!description){this.name = "Activity description";}
        else{this.description = description;}

        if(!temperature){this.temperature = 20;}
        else{this.temperature = temperature;}

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
        this.temperature = temp;
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
        return (this.rain*25);
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

