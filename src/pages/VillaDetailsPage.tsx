import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Villa, User } from '../types';
import { Navbar } from '../components/Navbar';
import MapDisplay from '../components/MapDisplay';
import BookingForm from '../components/BookingForm';
import { Footer } from '../components/Footer';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';

interface VillaDetailsPageProps {
    villas: Villa[];
    currentUser: User | null;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    handleLogout: () => void;
}

export const VillaDetailsPage: React.FC<VillaDetailsPageProps> = ({
    villas,
    currentUser,
    theme,
    toggleTheme,
    handleLogout
}) => {
    const { id } = useParams<{ id: string }>();
    const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);
    const [ratingStats, setRatingStats] = useState({ rating: 0, count: 0 });

    useEffect(() => {
        const villa = villas.find(v => v.id === id);
        if (villa) {
            setSelectedVilla(villa);
            window.scrollTo(0, 0);

            // Fetch reviews
            ApiService.getReviews(villa.id).then(reviews => {
                const count = reviews.length;
                const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
                setRatingStats({
                    rating: count > 0 ? parseFloat((sum / count).toFixed(1)) : 0,
                    count
                });
            });
        }
    }, [id, villas]);

    if (!selectedVilla) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Navbar currentUser={currentUser} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} />
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Villa Not Found</h2>
                    <Link to="/" className="text-blue-500 hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    const { rating, count } = ratingStats;

    return (
        <div className="animate-fade-in min-h-screen flex flex-col">
            <Navbar currentUser={currentUser} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} />

            <div className="max-w-7xl mx-auto px-6 py-12 flex-grow">
                <Link to="/" className="mb-10 flex items-center text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <i className="fas fa-arrow-left mr-3"></i> Back to Collection
                </Link>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="h-[500px] md:h-[650px] rounded-3xl overflow-hidden shadow-2xl">
                            <img src={selectedVilla.imageUrl} alt={selectedVilla.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-6 lowercase tracking-tighter">{selectedVilla.name}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-base text-gray-500 mb-8 font-medium">
                                <span className="bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full">{selectedVilla.location}</span>
                                <span className="flex items-center gap-2"><i className="fas fa-star text-yellow-400"></i> {rating || 'New'} ({count} reviews)</span>
                                <span>•</span>
                                <span>{selectedVilla.capacity} Guests</span>
                            </div>
                            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{selectedVilla.description}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-center hover:scale-105 transition-transform">
                                    <i className="fas fa-bed text-brand-500 text-2xl mb-3"></i>
                                    <p className="text-lg font-bold dark:text-white">{selectedVilla.bedrooms}</p>
                                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Bedrooms</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-center hover:scale-105 transition-transform">
                                    <i className="fas fa-users text-brand-500 text-2xl mb-3"></i>
                                    <p className="text-lg font-bold dark:text-white">{selectedVilla.capacity}</p>
                                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Capacity</p>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-6 dark:text-white lowercase tracking-tight">Location on Map</h3>
                            <div className="h-96 rounded-3xl overflow-hidden mb-12 border-4 border-gray-50 dark:border-gray-800 shadow-lg">
                                <MapDisplay coordinates={selectedVilla.coordinates} popupText={selectedVilla.name} />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 sticky top-32">
                            <div className="mb-8">
                                {selectedVilla.discountPrice && selectedVilla.discountPrice > 0 ? (
                                    <div>
                                        <span className="text-sm text-gray-400 line-through font-medium">IDR {selectedVilla.pricePerNight.toLocaleString()}</span>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">IDR {selectedVilla.discountPrice.toLocaleString()}<span className="text-base font-normal text-gray-500"> / night</span></p>
                                        <div className="mt-2 inline-block bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded">Limited Offer</div>
                                    </div>
                                ) : (
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">IDR {selectedVilla.pricePerNight.toLocaleString()}<span className="text-base font-normal text-gray-500"> / night</span></p>
                                )}
                            </div>
                            {currentUser ? <BookingForm villa={selectedVilla} userId={currentUser.id} onSuccess={() => { }} /> : <Link to="/login" className="w-full block text-center bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all">Sign In to Continue</Link>}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500">Free cancellation within 24 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
