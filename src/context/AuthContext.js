import { createContext, useContext } from "react";
import { useLocalStorage } from '../hooks/useLocalStorage';
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({
    children
}) => {
    const [auth, setAuth] = useLocalStorage('auth', {});

    const userLoginHandler = (authData) => {
        setAuth(authData);
    };

    const userLogout = () => {
        setAuth({});
    };

    return (
        <AuthContext.Provider value={{
             user: auth,
             userLoginHandler,
             userLogout,
             isAuthenticated: !!auth.accessToken // Boolean
        }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom Hook (unUsed in this app)
export const useAuthContext = () => {
    const context = useContext(AuthContext);

    return context;
};

// Alternative of above with HOC
export const withAuth = (Component) => {
    const AuthWrapper = (props) => {
        const context = useContext(AuthContext);

        return <Component {...props} auth={context}/>
    }

    return AuthWrapper;
};