import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);


    const login = (token) => {
        setIsLoading(true);
        setUserToken(token); //จำลองการ login ด้วยการ set token ใน state
        AsyncStorage.setItem('userToken', token); // set token ใน local storage
        console.log("login!");
        setIsLoading(false);
    }

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userToken'); // remove token ใน local storage
        console.log("logout!");
        setIsLoading(false);
    }

    const isLoggedIn = async () => {
        try {
            let storedToken = await AsyncStorage.getItem('userToken');
            if (storedToken) {
                setUserToken(storedToken);
            } else {
                setUserToken(null); // Ensure userToken is null if no token is found
            }
        } catch (e) {
            console.log('isLoggedIn error:', e);
        } finally {
            setIsLoading(false); // Ensure isLoading is set to false regardless of success or failure
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
            {children}
        </AuthContext.Provider>
    );
}