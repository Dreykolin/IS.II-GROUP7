import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

const ClimaContext = createContext();

export const ClimaProvider = ({ children }) => {
  const [datosClima, setDatosClima] = useState(null);
  const [pronostico, setPronostico] = useState(null);
  const [puedeActualizar, setPuedeActualizar] = useState(true);

  const TIEMPO_LIMITE = 20 * 1000; // 20 segundos
  const ultimaActualizacionRef = useRef(0);

  // Cargar datos guardados en localStorage al montar
  useEffect(() => {
    const climaRaw = localStorage.getItem("datosClima");
    const pronosticoRaw = localStorage.getItem("pronostico");

    if (climaRaw) {
      try {
        setDatosClima(JSON.parse(climaRaw));
      } catch {}
    }
    if (pronosticoRaw) {
      try {
        setPronostico(JSON.parse(pronosticoRaw));
      } catch {}
    }
  }, []);

  const actualizarClima = useCallback(({ clima, pronostico }) => {
    if (clima) {
      localStorage.setItem("datosClima", JSON.stringify(clima));
      setDatosClima(clima);
    }
    if (pronostico) {
      localStorage.setItem("pronostico", JSON.stringify(pronostico));
      setPronostico(pronostico);
    }
    ultimaActualizacionRef.current = Date.now();
    setPuedeActualizar(false);
    setTimeout(() => setPuedeActualizar(true), TIEMPO_LIMITE);
  }, []);

  const obtenerUbicacionYClima = useCallback(() => {
    const ahora = Date.now();
    if (ahora - ultimaActualizacionRef.current < TIEMPO_LIMITE) {
      console.log("Cooldown activo: no se actualizará ahora");
      return;
    }

    if (!navigator.geolocation) {
      console.error("Geolocalización no disponible");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch("http://localhost:3000/clima", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }),
          });

          if (!res.ok) throw new Error("Error al obtener clima");

          const data = await res.json();

          const nuevoClima = {
            descripcion: data.descripcion,
            temperatura: Math.round(data.temperatura),
            ciudad: data.ciudad,
            viento: data.viento,
            humedad: data.humedad,
            tiempo_id: data.tiempo_id,
          };

          actualizarClima({ clima: nuevoClima, pronostico: data.pronostico });
        } catch (error) {
          console.error(error);
        }
      },
      (error) => {
        console.error("Error en geolocalización:", error);
      }
    );
  }, [actualizarClima]);

  // Ejecutar solo una vez al montar
  useEffect(() => {
    obtenerUbicacionYClima();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ClimaContext.Provider
      value={{ datosClima, pronostico, actualizarClima, obtenerUbicacionYClima, puedeActualizar }}
    >
      {children}
    </ClimaContext.Provider>
  );
  
};

export const useClima = () => useContext(ClimaContext);
