import React, { useState } from "react";
import { AuthContext } from "./useAuth";
import axios from "axios";
import { conf } from "../conf/config";

export interface AuthContextProps{
    islogin: boolean,
    userId: string | null,
    accessToken: string | null,
    login: (accessToken: string, userId: string) => void,
    logout: () => void
}

interface authProviderProps{
    children: React.ReactNode
}

export const AuthProvider: React.FC<authProviderProps> = ({children}) => {
    const [islogin, setIslogin] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string|null>(null);
    const [userId, setUserId] = useState<string|null>(null);
    
    const login = (accesstoken: string, userId: string) => {
        setIslogin(true);
        setAccessToken(accesstoken);
        setUserId(userId);
    }
    
    const logout = async() => {
        try {
            await axios.post(`${conf.BackendUrl}/signout`, {}, {
                withCredentials: true
            })
            setIslogin(false);
            setAccessToken(null);
            setUserId(null)
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <AuthContext.Provider value={{islogin, accessToken, userId, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}