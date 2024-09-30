'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

interface User {
    username: string;
    password: string;
}

interface UserData {
    display_name: string;
    firstname: string;
    lastname: string,
    mail: string;
    nickname: string;
    addresses: Address[]
}

interface Address {
    address1: string;
    address2 : string ;
    billing : boolean;
    city : string;
    company : string;
    country : string;
    email : string;
    firstname : string;
    id : number;
    lastname : string;
    phone : string;
    postalCode : number;
    shipping : boolean 
}

export interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    isSignedIn: boolean;
    login: (User: User) => Promise<void>;
    logout: () => void;
    register: (User: User) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [userData, setUserData] = useState<UserData | null>(null)
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
        // Check for token and auto-login 
        if (localStorage.getItem('token')) {
            setIsSignedIn(true)
        }
        // const checkUserLoggedIn = async () => {
        //     try {
        //         const { data } = await axios.get('/api/auth/me');
        //         setUser(data.user);
        //         setIsSignedIn(true)
        //     } catch (err) {
        //         setUser(null);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // checkUserLoggedIn();
    }, []);


    const login = async (user: User) => {
        console.log(user)
        setLoading(true);
        try {
            const { data } = await axios.post('https://api.monplancbd.fr/login', user,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(data)
            localStorage.setItem('token', data.accessToken)
            setUserData({
                display_name: data.display_name,
                firstname: data.firstname,
                lastname: data.lastname,
                mail: data.mail,
                nickname: data.nickname,
                addresses: data.addresses
            });
            setIsSignedIn(true)
            router.push('/');


        } catch (err) {
            console.error(err);
            setUser(null);
        } finally {
            setLoading(false); ``
        }
    };

    const logout = async () => {
        console.log('logout')
        try {
            const logoutUser = await axios.get(`https://api.monplancbd.fr/logout`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(logoutUser)
        }
        catch (err) {
            console.error(err);
        }
        localStorage.clear()
        setUser(null);
        setIsSignedIn(false)
        router.push('/');
    };

    const register = async (user: User) => {
        setLoading(true);
        try {
            const newUser = await axios.post('/api/auth/register', { user });
            console.log(newUser)
            await login(user); // Auto-login after registration
            setIsSignedIn(true)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, isSignedIn, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
