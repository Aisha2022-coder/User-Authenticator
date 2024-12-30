import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Dashboard = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [quote, setQuote] = useState('');
    const [joke, setJoke] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        signupDate: new Date().toLocaleDateString()
    });

    useEffect(() => {
        if (auth?.token === 'undefined') {
            navigate('/login');
        }
    }, [auth, navigate]);  
    
    useEffect(() => {
        fetchQuote();
        fetchJoke();
    }, []);

    console.log({auth});
    const fetchQuote = async () => {
        try {
            const response = await axios.get('https://api.freeapi.app/api/v1/public/quotes/random');
            if (response.data?.data?.content) {
                setQuote(response.data.data.content);
            }
        } catch (error) {
            const fallbackQuotes = [
                "Life is what happens while you're busy making other plans.",
                "The best way to predict the future is to create it.",
                "Success is walking from failure to failure with no loss of enthusiasm.",
            ];
            setQuote(fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]);
        }
    };

    const fetchJoke = async () => {
        try {
            const response = await axios.get('https://api.freeapi.app/api/v1/public/randomjokes/random', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data?.data) {
                setJoke(response.data.data);
            }
        } catch (error) {
            const fallbackJokes = [
                "Why do programmers prefer dark mode? Because light attracts bugs!",
                "What did the developer say to the coffee maker? Thanks a latte!",
                "Why did the JavaScript developer wear glasses? Because he couldn't C#!",
                "What's a programmer's favorite place? The Cookie Store!"
            ];
            const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
            setJoke(randomJoke);
            console.log('Fetching new joke:', randomJoke);
        }
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setIsEditing(false);
        } catch (error) {
            console.error('Profile update failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <h1 className="text-3xl font-bold text-blue-600 mb-8">
                                    Welcome, {profile.name}!
                                </h1>
                                
                                <div className="bg-blue-50 p-4 rounded-lg mb-8">
                                    <p className="italic text-gray-600">"{quote}"</p>
                                    <button 
                                        onClick={fetchQuote}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        New Quote
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6 mb-8">
                                    <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
                                    {isEditing ? (
                                        <form onSubmit={handleProfileUpdate}>
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                                    className="w-full p-2 border rounded"
                                                    placeholder="Name"
                                                />
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                                                    className="w-full p-2 border rounded"
                                                    placeholder="Email"
                                                />
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-2">
                                            <p><span className="font-semibold">Name:</span> {profile.name}</p>
                                            <p><span className="font-semibold">Email:</span> {profile.email}</p>
                                            <p><span className="font-semibold">Member Since:</span> {profile.signupDate}</p>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
                                            >
                                                Edit Profile
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">Random Joke</h3>
                                    <p className="text-gray-700">{joke}</p>
                                    <button
                                        onClick={fetchJoke}
                                        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                    >
                                        Get New Joke
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;