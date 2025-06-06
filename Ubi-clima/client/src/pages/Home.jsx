import { useState, useEffect } from 'react';
import { useClima } from '../context/ClimaContext';
import TarjetaCiudad from "../components/home/TarjetaCiudad";
import RecommendationsList from "../components/home/RecommendationsList";
import ShortHistory from "../components/home/ShortHistory";
import Pronostico from "../components/home/Pronostico"; // Importa el componente Pronóstico
import '../assets/home.css';

function Home({ handleLoginRedirect }) {
  const { datosClima } = useClima();
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [mostrarPronostico, setMostrarPronostico] = useState(false); // Estado para alternar entre clima y pronóstico

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUsuarioAutenticado(!!token);
  }, []);

  const ciudad = datosClima?.ciudad || '';

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
            <RecommendationsList />
          </div>

          <div className="flex-container">
            <ShortHistory />
          </div>

          <div className="flex-container-2">
            {/* Mostrar "Resumen del clima de hoy" solo cuando no se muestre el pronóstico */}
            {!mostrarPronostico && <h2>Resumen del clima de hoy</h2>}

            {/* Alternamos entre TarjetaCiudad y Pronostico */}
            {!mostrarPronostico ? (
              <>
                <TarjetaCiudad/>
                <button
                  onClick={() => setMostrarPronostico(true)} // Cambiar a pronóstico
                  className="btn"
                >
                  Ver pronóstico
                </button>
              </>
            ) : (
              <>
                <Pronostico />
                <button
                  onClick={() => setMostrarPronostico(false)} // Volver al clima de hoy
                  className="btn"
                >
                  Ver clima de hoy
                </button>
              </>
            )}
          </div>

        </>
      )}

      <header id="home" className="hero">
        <div className="hero-content">
          <h1>¡Descubre qué hacer hoy con el clima a tu favor!</h1>
          <p>Recomendaciones personalizadas para cada día, cada clima y cada persona.</p>
          <div className="hero-buttons">
            <a href="#activities" className="btn primary">Ver recomendaciones</a>
            {!usuarioAutenticado ? (
              <a href="#settings" className="btn secondary" onClick={handleLoginRedirect}>Iniciar Sesión</a>
            ) : null}
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
