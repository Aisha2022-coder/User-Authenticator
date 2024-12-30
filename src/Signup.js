import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);  

    const initialValues = { username: '', email: '', password: '' };  

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must not exceed 20 characters')
            .required('Required')
            .matches(/^[a-z]+$/, 'Username must be in lowercase'),
        email: Yup.string().email('Invalid email format').required('Required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Must contain at least one number')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character')
    });

    const handleSubmit = async (values) => {
        setLoading(true);  
        try {
            const response = await axios.post('https://api.freeapi.app/api/v1/users/register', values);
            const { user } = response.data.data;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userId', user._id);
            localStorage.setItem('accessToken', response.data.data.accessToken);

            setAuth({
                user,
                userId: user._id,
                token: response.data.data.accessToken,
                isAuthenticated: true,
            });

            navigate('/login');
        } catch (error) {
            console.error('Signup failed:', error);
            setServerError(error.response?.data?.data?.message || 'Already a registered user. Try to log in.');
        } finally {
            setLoading(false);  
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
                {serverError && <div className="mb-4 text-red-500 text-center">{serverError}</div>}
                {loading ? (
                    <div>Loading...</div>  
                ) : (
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        <Form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <Field type="text" name="username" placeholder="Enter your username" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <Field type="email" name="email" placeholder="Enter your email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <Field type="password" name="password" placeholder="Enter your password" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                            </div>
                            <button type="submit" className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all">Signup</button>
                        </Form>
                    </Formik>
                )}
            </div>
        </div>
    );
};

export default Signup;
