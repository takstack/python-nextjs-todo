import { createContext, useContext, useState, useEffect } from "react";
import { account } from "../lib/appwrite";


const GlobalContext = createContext({
    user: null,
    authLoading: true,
});

export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [authLoading, setAuthIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchUser = async () => {
        try {
            const user = await account.get()
            console.log('user', user)
            setUser(user)
            setAuthIsLoading(false)
        } catch (error) {
            console.error('Error fetching user', error)
            setAuthIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const config = {
        user,
        setUser,
        authLoading
    }

    return (
        <GlobalContext.Provider value={config}>
            {children}
        </GlobalContext.Provider>
    )

};

export const useGlobalContext = () => useContext(GlobalContext);


