import { createContext, useContext } from "react";
import { AuthContextProps } from "./authContext";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context;
}