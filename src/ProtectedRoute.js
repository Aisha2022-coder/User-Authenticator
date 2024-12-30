import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { auth, loading } = useAuth();
    // const { getuserId } = useAuth();
    // const userId = getuserId();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
                <div className="p-8 rounded-lg shadow-xl bg-white dark:bg-gray-800 transition-all duration-300">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            Loading...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!auth?.userId) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;














