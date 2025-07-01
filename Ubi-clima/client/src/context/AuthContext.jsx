import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (storedToken && storedUser) {
                setToken(JSON.parse(storedToken));
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            localStorage.clear();
            console.error("Error al cargar sesión", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback((loginData) => {
        try {
            const userData = {
                id: loginData.usuario_id,
                email: loginData.email,
                tours_vistos: loginData.tours_vistos,
                preferencias: loginData.preferencias
            };
            setUser(userData);
            setToken(loginData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', JSON.stringify(loginData.token));
        } catch (error) {
            console.error("Error al procesar login", error);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.clear();
        window.location.reload();
    }, []);

    const markTourAsSeen = useCallback((tourName) => {
        if (!user) return;
        setUser(prevUser => {
            const newToursVistos = { ...prevUser.tours_vistos, [tourName]: true };
            const newUser = { ...prevUser, tours_vistos: newToursVistos };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    }, [user]);

    // ⬇️ ¡LA FUNCIÓN QUE FALTABA! ⬇️
    // Esta función actualiza las preferencias en el estado del contexto.
    const updateUserPreferences = useCallback((newPreferences) => {
        if (!user) return;
        setUser(prevUser => {
            const newUser = { ...prevUser, preferencias: newPreferences };
            // También actualizamos el localStorage para que persista
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    }, [user]);


    if (isLoading) {
        return <div>Cargando sesión...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
                markTourAsSeen,
                updateUserPreferences, // ⬅️ La añadimos para que esté disponible en la app
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};