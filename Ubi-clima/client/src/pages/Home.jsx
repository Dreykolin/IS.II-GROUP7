import { useState, useEffect, useRef } from 'react';
import { useClima } from '../context/ClimaContext';
import TarjetaCiudad from "../components/home/TarjetaCiudad";
import RecommendationsList from "../components/home/RecommendationsList";
import ShortHistory from "../components/home/ShortHistory";
import Pronostico from "../components/home/Pronostico";
import '../assets/home.css';

function Home({handleLoginRedirect}) {
  const { datosClima, pronostico } = useClima();

  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const climaRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUsuarioAutenticado(!!token);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        localStorage.setItem('bloqueClimaVisible', visible ? '1' : '0');
      },
      { threshold: 0.1 }
    );

    if (climaRef.current) {
      observer.observe(climaRef.current);
    }

    return () => {
      if (climaRef.current) observer.unobserve(climaRef.current);
    };
  }, []);

  const climaAutomatico = datosClima
    ? `${datosClima.descripcion}, ${datosClima.temperatura}°C`
    : '';

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
        <div className="flex-container-2">
          <h2>Resumen del clima de hoy</h2>
          <TarjetaCiudad />
        </div>

        {/* Aquí insertamos el componente Pronostico */}
        <Pronostico />

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
