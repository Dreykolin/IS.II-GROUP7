import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// 1. Crear el contexto (sin cambios)
const AuthContext = createContext();

// Hook personalizado para usar el contexto (sin cambios)

// 2. Crear el Proveedor del contexto
export const AuthProvider = ({ children }) => {
    // El estado 'user' ahora guardará el objeto tours_vistos
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar datos de la sesión desde localStorage al iniciar (sin cambios)
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(JSON.parse(storedToken));
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.error("Error al cargar la sesión desde localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ⬅️ CAMBIO 1: La función 'login' ahora maneja 'tours_vistos'
    const login = useCallback((loginData) => {
        try {
            const userData = {
                id: loginData.usuario_id,
                email: loginData.email,
                tours_vistos: loginData.tours_vistos // En lugar de tour_completado
            };
            const userToken = loginData.token;

            setUser(userData);
            setToken(userToken);

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', JSON.stringify(userToken));

        } catch (error) {
            console.error("Error al procesar los datos de login", error);
        }
    }, []);

    // La función 'logout' se mantiene igual
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario_id');
        window.location.reload();
    }, []);

    // ⬅️ CAMBIO 2: Reemplazamos 'updateUser' por una función más específica
    const markTourAsSeen = useCallback((tourName) => {
        // Nos aseguramos de que haya un usuario antes de intentar actualizar
        if (!user) return;

        setUser(prevUser => {
            // Creamos un nuevo objeto de tours para no mutar el estado directamente
            const newToursVistos = {
                ...prevUser.tours_vistos,
                [tourName]: true // Actualizamos el tour específico a 'true'
            };

            // Creamos el objeto de usuario actualizado
            const newUser = { ...prevUser, tours_vistos: newToursVistos };

            // Actualizamos localStorage para que el cambio persista
            localStorage.setItem('user', JSON.stringify(newUser));

            // Devolvemos el nuevo estado del usuario
            return newUser;
        });
    }, [user]); // Depende del estado del 'user'

    if (isLoading) {
        return <div>Cargando sesión...</div>;
    }

    // ⬅️ CAMBIO 3: Añadimos 'markTourAsSeen' al valor del proveedor
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
                markTourAsSeen, // La nueva función para marcar tours
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 8. Hook personalizado para usar el contexto, igual que 'useClima'
export const useAuth = () => useContext(AuthContext);