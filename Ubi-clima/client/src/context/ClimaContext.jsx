import { createContext, useContext, useEffect, useState } from "react";

const ClimaContext = createContext();

export const ClimaProvider = ({ children }) => {
  const [datosClima, setDatosClima] = useState(null);
  const [pronostico, setPronostico] = useState(null);

  // Cargar al montar desde localStorage
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

  // Función para actualizar y propagar clima
  const actualizarClima = ({ clima, pronostico }) => {
    if (clima) {
      localStorage.setItem("datosClima", JSON.stringify(clima));
      setDatosClima(clima);
    }

    if (pronostico) {
      localStorage.setItem("pronostico", JSON.stringify(pronostico));
      setPronostico(pronostico);
    }
  };

  return (
    <ClimaContext.Provider value={{ datosClima, pronostico, actualizarClima }}>
      {children}
    </ClimaContext.Provider>
  );
};

// Custom hook para consumir fácilmente
export const useClima = () => useContext(ClimaContext);
