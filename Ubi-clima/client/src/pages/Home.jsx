import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import Card from '../components/Card';
import axios from 'axios'; // Importamos axios para la comunicación con el backend

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);  // Para mostrar un estado de carga
  const navigate = useNavigate();  // Hook para redirigir

  // Array de las tarjetas
  const cards = [
    { id: 1, title: "Salir a Trotar", description: "", price: "" },
    { id: 2, title: "a", description: "", price: "" },
    { id: 3, title: "b", description: "", price: "" },
    { id: 4, title: "c", description: "", price: "" },
    { id: 5, title: "d", description: "", price: "" },
    { id: 6, title: "e", description: "", price: "" },
    { id: 7, title: "f", description: "", price: "" },
    { id: 8, title: "g", description: "", price: "" },
  ];

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Hacemos una solicitud al backend para verificar el token
          const response = await axios.post('http://localhost:3000/verify-token', { token });
          
          if (response.data.success) {
            setIsLogged(true); // Si el token es válido, el usuario está logueado
          } else {
            setIsLogged(false);
          }
        } catch (err) {
          console.error('Error al verificar el token:', err);
          setIsLogged(false);
        }
      } else {
        setIsLogged(false); // Si no hay token, el usuario no está logueado
      }
      setLoading(false);  // Dejamos de mostrar el cargando
    };

    checkSession();
  }, []);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>; // Mostrar mientras verificamos la sesión
  }

  return (
    <div className="p-4 rounded shadow" style={{ backgroundColor: '#f0f8ff', minHeight: '1000vh' }}>
      {isLogged ? (
        <>
          <h1>¡Bienvenido de nuevo!</h1>
          <p>Aquí están las actividades disponibles para ti:</p>
          <div className="row row-cols-4 row-cols-md-3 row-cols-lg-4 g-5 mt-4">
            {cards.map(card => (
              <div key={card.id} className="col">
                <Card 
                  title={card.title}
                  description={card.description}
                  price={card.price}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1>¡Bienvenido a nuestra página!</h1>
          <p>Para empezar, por favor inicia sesión.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={handleLoginRedirect}  // Llama a la función para redirigir al login
          >
            Iniciar sesión
          </button>
        </>
      )}
    </div>
  );
}
	
