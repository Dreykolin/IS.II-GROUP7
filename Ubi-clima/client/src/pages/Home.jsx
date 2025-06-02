import { useState, useEffect } from 'react';
import TarjetaCiudad from "../components/TarjetaCiudad";
import RecommendationsList from "../components/RecommendationsList";
import ShortHistory from "../components/ShortHistory";

import '../assets/home.css';

function Home() {
    const [ubicacionAutomatica, setUbicacionAutomatica] = useState('');
    const [climaAutomatico, setClimaAutomatico] = useState('');
    const [datosClima, setDatosClima] = useState(null);
    const [pronostico, setPronostico] = useState(null);
    const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUsuarioAutenticado(true);

            const ubicacionGuardada = localStorage.getItem('ubicacion');
            const climaGuardado = localStorage.getItem('clima');

            if (ubicacionGuardada && climaGuardado) {
                setUbicacionAutomatica(ubicacionGuardada);
                setClimaAutomatico(climaGuardado);
            }

            obtenerUbicacionAutomatica();

            const intervalo = setInterval(() => {
                obtenerUbicacionAutomatica();
            }, 10 * 60 * 1000);

            return () => clearInterval(intervalo);
        } else {
            setUsuarioAutenticado(false);
        }
    }, []);

    const obtenerUbicacionAutomatica = () => {
        if (!navigator.geolocation) {
            setUbicacionAutomatica("La geolocalización no es compatible.");
            return;
        }

        setCargando(true);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitud = position.coords.latitude;
            const longitud = position.coords.longitude;

            try {
                const climaRes = await fetch('http://localhost:3000/clima', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat: latitud, lon: longitud })
                });

                const datosClima = await climaRes.json();
                const climaTexto = `Clima: ${datosClima.descripcion}, ${datosClima.temperatura}°C`;
                const ubicacionTexto = `Ciudad: ${datosClima.ciudad}`;

                setClimaAutomatico(climaTexto);
                setUbicacionAutomatica(ubicacionTexto);
                setDatosClima(datosClima);

                localStorage.setItem('clima', climaTexto);
                localStorage.setItem('ubicacion', ubicacionTexto);

                const pronosticoRes = await fetch('http://localhost:3000/pronostico', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat: latitud, lon: longitud })
                });

                const pronosticoData = await pronosticoRes.json();
                setPronostico(pronosticoData);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Error al obtener datos del clima o pronóstico.");
                setPronostico(null);
            } finally {
                setCargando(false);
            }
        }, (err) => {
            console.error(err);
            setError("No se pudo obtener la ubicación.");
            setCargando(false);
        });
    };

    return (
        <div className="clima-page">
            {/* Si el usuario no está autenticado, mostramos el mensaje para iniciar sesión */}
            {!usuarioAutenticado ? (
                <>
                    <div className="flex-container">
                        <div className="alert alert-warning alerta-usuario">
                            <h2>Para acceder a la aplicación, necesitas iniciar sesión</h2>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex-container">
                        <div className="tarjeta-ciudad-container">
                            <h1>Mi Ubicación Actual</h1>
                            <TarjetaCiudad automatico={true} clima={climaAutomatico} ubicacion={ubicacionAutomatica} />
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
                                <h1>Pronóstico para {ubicacionAutomatica}</h1>
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

            <header id="home" class="hero">
                <div class="hero-content">
                    <h1>¡Descubre qué hacer hoy con el clima a tu favor!</h1>
                    <p>Recomendaciones personalizadas para cada día, cada clima y cada persona.</p>
                    <div class="hero-buttons">
                        <a href="#activities" class="btn primary">Ver recomendaciones</a>
                        <a href="#settings" class="btn secondary">Configura tus preferencias</a>
                    </div>
                </div>
            </header>

            <div className='flex-container'>
                <section id="activities" class="activities">
                    <h2>Actividades recomendadas</h2>
                    <div class="cards">
                        <div class="card">
                            <img src="public\yoga.avif" alt="Yoga"></img>
                            <h3>Yoga en el parque</h3>
                            <p>Perfecto para clima soleado 🌞</p>
                            <a href="#" class="btn small">Más detalles</a>
                        </div>
                        <div class="card">
                            <img src="public\bici.jpg" alt="Bicicleta"></img>
                            <h3>Paseo en bicicleta</h3>
                            <p>Ideal con poco viento 💨</p>
                            <a href="#" class="btn small">Más detalles</a>
                        </div>
                        <div class="card">
                            <img src="public\fotootoño.jpg" alt="Fotografía"></img>
                            <h3>Fotografía de otoño</h3>
                            <p>Cielo nublado, luz suave 🌥</p>
                            <a href="#" class="btn small">Más detalles</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );

}

export default Home;
