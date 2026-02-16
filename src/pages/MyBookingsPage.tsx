import React, { useEffect, useState } from 'react';
import { User, Booking } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ApiService } from '../services/apiService';

interface MyBookingsPageProps {
    currentUser: User | null;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    handleLogout: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ currentUser, theme, toggleTheme, handleLogout }) => {
    const [userBookings, setUserBookings] = useState<Booking[]>([]);

    useEffect(() => {
        async function load() {
            if (currentUser) {
                const bookings = await ApiService.getUserBookings(currentUser.id);
                setUserBookings(bookings);
            }
        }
        load();
    }, [currentUser]);

    return (
        <div className="animate-fade-in min-h-screen flex flex-col">
            <Navbar currentUser={currentUser} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} />
            <div className="max-w-4xl mx-auto px-6 py-16 text-center flex-grow">
                <h1 className="text-4xl font-light mb-8 lowercase tracking-tighter dark:text-white">My Bookings</h1>
                {userBookings.length === 0 ? (
                    <div className="p-20 bg-gray-50 dark:bg-gray-800 rounded-[3rem] border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-xl text-gray-500">Your future escapes will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Better booking display could be added here, currently just a list or JSON for MVP */}
                        {userBookings.map(b => (
                            <div key={b.id} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-left">
                                <div className="font-bold">Booking #{b.id}</div>
                                <div>Villa ID: {b.villaId}</div>
                                <div>{b.startDate} - {b.endDate}</div>
                                <div className="text-brand-500 font-bold">{b.status}</div>
                                <div>Total: IDR {b.totalPrice.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};
