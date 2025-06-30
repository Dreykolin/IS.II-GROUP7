import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// 1. Crear el contexto, igual que en ClimaContext
const AuthContext = createContext();

// 2. Crear el Proveedor del contexto
export const AuthProvider = ({ children }) => {
    // Estado para guardar el objeto completo del usuario: { id, email, tour_completado }
    const [user, setUser] = useState(null);
    // Estado para el token, que determina si el usuario est� logueado
    const [token, setToken] = useState(null);
    // Estado para saber si estamos verificando la sesi�n inicial
    const [isLoading, setIsLoading] = useState(true);

    // 3. Cargar datos de la sesi�n desde localStorage al iniciar la app
    // Similar a como ClimaContext carga los datos del clima.
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(JSON.parse(storedToken));
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            // Si hay un error en localStorage, limpiamos la sesi�n
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.error("Error al cargar la sesi�n desde localStorage", error);
        } finally {
            setIsLoading(false); // Terminamos de cargar, haya o no sesi�n
        }
    }, []);

    // 4. Funci�n para iniciar sesi�n, similar a 'actualizarClima'
    const login = useCallback((loginData) => {
        try {
            // Extraemos los datos que nos env�a el backend
            const userData = {
                id: loginData.usuario_id,
                email: loginData.email,
                tour_completado: loginData.tour_completado
            };
            const userToken = loginData.token;

            // Guardamos en estado
            setUser(userData);
            setToken(userToken);

            // Guardamos en localStorage, como en ClimaContext
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', JSON.stringify(userToken));

        } catch (error) {
            console.error("Error al procesar los datos de login", error);
        }
    }, []);

    // 5. Funci�n para cerrar sesi�n
    const logout = useCallback(() => {
        // Limpiamos el estado
        setUser(null);
        setToken(null);

        // Limpiamos localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario_id'); // Por si queda algo del sistema antiguo

        // Recargamos la p�gina como en tu l�gica original de App.jsx
        window.location.reload();
    }, []);

    // 6. Funci�n para actualizar el usuario localmente (para el tour)
    const updateUser = useCallback((updatedData) => {
        setUser(prevUser => {
            const newUser = { ...prevUser, ...updatedData };
            // Tambi�n actualizamos el localStorage para que persista
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    }, []);

    // Si a�n est� cargando la sesi�n inicial, podemos mostrar un loader
    // para evitar parpadeos en la UI.
    if (isLoading) {
        return <div>Cargando sesi�n...</div>;
    }

    // 7. Proveemos el 'value' a los componentes hijos
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token, // Booleano para saber si hay sesi�n
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 8. Hook personalizado para usar el contexto, igual que 'useClima'
export const useAuth = () => useContext(AuthContext);