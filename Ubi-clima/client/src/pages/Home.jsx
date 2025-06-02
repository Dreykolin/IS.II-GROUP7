import { useState, useEffect } from 'react';
import TarjetaCiudad from "../components/TarjetaCiudad";
import RecommendationsList from "../components/RecommendationsList";
import ShortHistory from "../components/ShortHistory";
import '../assets/home.css';
import { useRef } from 'react';


function Home() {
  const [climaAutomatico, setClimaAutomatico] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pronostico, setPronostico] = useState(null);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUsuarioAutenticado(true);


    const datosCrudos = localStorage.getItem('datosClima');
    if (datosCrudos) {
        try {
            const datos = JSON.parse(datosCrudos);
            if (datos.descripcion && datos.temperatura) {
            setClimaAutomatico(`${datos.descripcion}, ${datos.temperatura}°C`);
            }
            if (datos.ciudad) {
            setCiudad(datos.ciudad);
            }
        } catch (err) {
            console.error("Error al leer datosClima:", err);
        }
    }

      const pronosticoGuardado = localStorage.getItem('pronostico');
      if (pronosticoGuardado) {
        try {
          setPronostico(JSON.parse(pronosticoGuardado));
        } catch (e) {
          console.error("Error al leer pronóstico:", e);
        }
      }
    } else {
      setUsuarioAutenticado(false);
    }
  }, []);

  return (
    <div className="clima-page">
      {!usuarioAutenticado ? (
        <div className="flex-container">
          <div className="alert alert-warning alerta-usuario">
            <h2>Para acceder a la aplicación, necesitas iniciar sesión</h2>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-container">
            <div className="tarjeta-ciudad-container">
              <h1>Mi Ubicación Actual</h1>
              <TarjetaCiudad automatico={true} clima={climaAutomatico} ubicacion={ciudad} />
            </div>
            <div className="tarjeta-ciudad-container">
              <h1>Buscar otra Ciudad</h1>
              <TarjetaCiudad />
            </div>
          </div>

          {cargando ? (
            <p style={{ textAlign: "center" }}>⏳ Cargando pronóstico...</p>
          ) : error ? (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          ) : (
            pronostico && (
              <div className="pronostico-container">
                <h1>Pronóstico para {ciudad}</h1>
                <div className="dias-pronostico">
                  {pronostico.resumenDiario.map((dia) => (
                    <div className="dia-card" key={dia.fecha}>
                      <h3>{dia.fecha}</h3>
                      <img
                        src={`https://openweathermap.org/img/wn/${dia.icono}@2x.png`}
                        alt={dia.descripcion}
                        className="icono-clima"
                      />
                      <p>{dia.descripcion}</p>
                      <p><strong>Max:</strong> {dia.temp_max}°C</p>
                      <p><strong>Min:</strong> {dia.temp_min}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          <div className="flex-container">
            <RecommendationsList />
          </div>

          <div className="flex-container">
            <ShortHistory />
          </div>
        </>
      )}

      <header id="home" className="hero">
        <div className="hero-content">
          <h1>¡Descubre qué hacer hoy con el clima a tu favor!</h1>
          <p>Recomendaciones personalizadas para cada día, cada clima y cada persona.</p>
          <div className="hero-buttons">
            <a href="#activities" className="btn primary">Ver recomendaciones</a>
            <a href="#settings" className="btn secondary">Configura tus preferencias</a>
          </div>
        </div>
      </header>

      <div className="flex-container">
        <section id="activities" className="activities">
          <h2>Actividades recomendadas</h2>
          <div className="cards">
            <div className="card">
              <img src="public/yoga.avif" alt="Yoga" />
              <h3>Yoga en el parque</h3>
              <p>Perfecto para clima soleado 🌞</p>
              <a href="#" className="btn small">Más detalles</a>
            </div>
            <div className="card">
              <img src="public/bici.jpg" alt="Bicicleta" />
              <h3>Paseo en bicicleta</h3>
              <p>Ideal con poco viento 💨</p>
              <a href="#" className="btn small">Más detalles</a>
            </div>
            <div className="card">
              <img src="public/fotootoño.jpg" alt="Fotografía" />
              <h3>Fotografía de otoño</h3>
              <p>Cielo nublado, luz suave 🌥</p>
              <a href="#" className="btn small">Más detalles</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
