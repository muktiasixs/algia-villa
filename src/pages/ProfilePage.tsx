import React, { useState } from 'react';
import { User } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { StorageService } from '../services/storageService';

interface ProfilePageProps {
    currentUser: User | null;
    setCurrentUser: (user: User) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    handleLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, setCurrentUser, theme, toggleTheme, handleLogout }) => {
    const [profileForm, setProfileForm] = useState<Partial<User>>(currentUser || {});

    const handleProfileSave = () => {
        if (!currentUser || !profileForm.name || !profileForm.email) return;
        const updatedUser: User = {
            ...currentUser,
            name: profileForm.name,
            email: profileForm.email,
            avatar: profileForm.avatar || currentUser.avatar
        };
        StorageService.saveUser(updatedUser);
        setCurrentUser(updatedUser);
        alert('Profile updated!');
    };

    return (
        <div className="animate-fade-in min-h-screen flex flex-col">
            <Navbar currentUser={currentUser} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} />
            <div className="max-w-2xl mx-auto px-6 py-16 text-center flex-grow">
                <h1 className="text-4xl font-light mb-8 lowercase tracking-tighter dark:text-white">Profile Settings</h1>
                <div className="p-12 bg-white dark:bg-gray-800 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700 text-left">
                    <div className="flex justify-center mb-10">
                        <img src={currentUser?.avatar} className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-xl" />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                            <input className="w-full p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg font-bold" defaultValue={currentUser?.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                            <input className="w-full p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg font-bold" defaultValue={currentUser?.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
                        </div>
                        <button onClick={handleProfileSave} className="w-full py-4 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-2xl text-lg font-bold shadow-lg mt-6">Update Profile</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
