import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
    currentUser: User | null;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    handleLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, theme, toggleTheme, handleLogout }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const SunIcon = () => <i className="fas fa-sun text-yellow-400 text-lg"></i>;
    const MoonIcon = () => <i className="fas fa-moon text-gray-400 text-lg"></i>;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onLogout = () => {
        handleLogout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-[60] w-full bg-gray-50 dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                <Link to="/" className="cursor-pointer">
                    <span className="text-3xl font-light text-gray-900 dark:text-gray-100 lowercase tracking-tighter">algia</span>
                </Link>

                <div className="flex items-center gap-6">
                    <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    {currentUser ? (
                        <div className="relative" ref={userMenuRef}>
                            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center">
                                <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-3 border border-gray-100 dark:border-gray-700 z-[100] animate-fade-in">
                                    <div className="px-4 py-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                                        <p className="text-sm font-bold dark:text-white truncate">{currentUser.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                                    </div>
                                    {currentUser.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setShowUserMenu(false)} className="block w-full text-left px-4 py-2.5 text-base dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Admin Panel</Link>
                                    )}
                                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="block w-full text-left px-4 py-2.5 text-base dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Profile</Link>
                                    <Link to="/bookings" onClick={() => setShowUserMenu(false)} className="block w-full text-left px-4 py-2.5 text-base dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">My Bookings</Link>
                                    <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-base text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700 mt-2 font-medium">Log out</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="text-base font-semibold border-2 border-gray-900 dark:border-gray-100 px-6 py-2 rounded-full hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-black transition-all uppercase tracking-widest text-gray-900 dark:text-gray-100"
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
