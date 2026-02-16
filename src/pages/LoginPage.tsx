import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { MOCK_ADMIN_USER, MOCK_NORMAL_USER } from '../constants';
import { StorageService } from '../services/storageService';

interface LoginPageProps {
    setCurrentUser: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setCurrentUser }) => {
    const navigate = useNavigate();

    const handleLogin = (role: 'user' | 'admin') => {
        const baseUser = role === 'admin' ? MOCK_ADMIN_USER : MOCK_NORMAL_USER;
        const storedUser = StorageService.getUser(baseUser.id);
        const user = storedUser || baseUser;

        // In a real app, you wouldn't save user just by "logging in" without credentials, 
        // but preserving existing logic:
        if (!storedUser) {
            StorageService.saveUser(user);
        }

        setCurrentUser(user);
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 animate-fade-in">
            <div className="w-full max-w-md p-12 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl text-center border border-gray-100 dark:border-gray-800">
                <h2 className="text-5xl font-light mb-12 dark:text-white lowercase tracking-tighter">welcome back</h2>
                <div className="space-y-6">
                    <button onClick={() => handleLogin('user')} className="w-full py-5 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-3xl text-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-3">
                        <i className="fas fa-user-circle text-2xl"></i> Login as Guest
                    </button>
                    <button onClick={() => handleLogin('admin')} className="w-full py-5 border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 rounded-3xl text-lg font-bold hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-black transition-all flex items-center justify-center gap-3">
                        <i className="fas fa-user-shield text-2xl"></i> Login as Admin
                    </button>
                </div>
                <p className="mt-12 text-sm text-gray-400 font-medium uppercase tracking-widest">Experience luxury at its peak</p>
            </div>
        </div>
    );
};
