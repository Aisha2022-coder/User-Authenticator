import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : {
            user: null,
            userId: null,
            token: null,
            isAuthenticated: false
        };
    });

    const [serverError, setServerError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getuserId = () => {
        return localStorage.getItem('userId');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedUserId = localStorage.getItem('userId');
        const storedaccessToken = localStorage.getItem('accessToken');
        
        if (storedUser && storedUserId && storedaccessToken) {
            setAuth({
                user: JSON.parse(storedUser),
                userId: storedUserId,
                token: storedaccessToken,
                isAuthenticated: true,
            });
        }
    }, []);

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('https://api.freeapi.app/api/v1/users/register', values);

            if (response.data.success) {
                const { user, userId } = response.data.data;

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userId', user._id);
                localStorage.setItem('accessToken', response.data.data.accessToken);
                setAuth({ user, userId, token: response.data.data.accessToken, isAuthenticated: true });
                console.log(response.data);
                navigate('/dashboard');
            } else {
                throw new Error(response.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup failed:', error.message);
            alert(error.message || 'An error occurred during registration');
        }
        finally {
            setLoading(false);
        }
    };

    const handleLogin = async (credentials) => {
        try {
            const response = await axios.post('https://api.freeapi.app/api/v1/users/login', credentials);
            if (response.data.success) {
                const { user } = response.data.data;

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userId', user._id);
                localStorage.setItem('accessToken', response.data.data.accessToken);

                setAuth({ user, userId: user._id, token: response.data.data.accessToken, isAuthenticated: true });
                navigate('/dashboard');
                console.log('Login successful:', user);
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            if (error.response?.status === 404) {
                alert('User does not exist. Please register first.');
            } else {
                console.error('Login failed:', error.message);
                alert(error.message || 'An error occurred during login.');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('accessToken');
        setAuth({ user: null, userId: null, token: null, isAuthenticated: false });

        navigate('/login');
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('accessToken');

        if (userId && user && token) {
            setAuth({
                userId,
                user,
                token,
                isAuthenticated: true
            });
        } 
    }, []);

    return (
        <AuthContext.Provider value={{
            auth,
            setAuth,
            handleRegister,
            handleLogin,
            getuserId,
            logout,
            loading,
            setLoading,
            serverError,
            setServerError
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
