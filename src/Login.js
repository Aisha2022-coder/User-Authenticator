import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
    const { handleLogin } = useAuth();
    const [serverError, setServerError] = useState('');
    // const navigate = useNavigate();

    const initialValues = { email: '', password: '' };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Required'),
        password: Yup.string().required('Required')
    });
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await handleLogin(values);
        } catch (error) {
            setServerError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className="flex justify-between items-center">
                                <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600 text-sm">
                                    Forgot Password?
                                </Link>
                                <Link to="/signup" className="text-blue-500 hover:text-blue-600 text-sm">
                                    Create Account
                                </Link>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                            {serverError && <div className="text-red-500 text-center">{serverError}</div>}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;