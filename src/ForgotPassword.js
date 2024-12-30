import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const [submitted, setSubmitted] = useState(false);

    const initialValues = { email: '' };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitted(true);
            console.log('Password reset requested for:', values.email);
        } catch (error) {
            console.error('Password reset request:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>
                {!submitted ? (
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
                                        placeholder="Enter your email"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
                                >
                                    {isSubmitting ? 'Sending...' : 'Reset Password'}
                                </button>
                                <div className="text-center">
                                    <Link to="/login" className="text-blue-500 hover:text-blue-600 text-sm">
                                        Back to Login
                                    </Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <div className="text-center">
                        <p className="text-green-600 mb-4">Password reset instructions have been sent to your email.</p>
                        <Link to="/login" className="text-blue-500 hover:text-blue-600">
                            Return to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;