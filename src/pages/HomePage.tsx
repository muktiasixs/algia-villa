import React from 'react';
import { Link } from 'react-router-dom';
import { Villa, LocationType, User } from '../types';
import { Navbar } from '../components/Navbar';
import { FilterBar } from '../components/FilterBar';
import { Footer } from '../components/Footer';

interface HomePageProps {
    villas: Villa[];
    filterLocation: LocationType | 'All';
    setFilterLocation: (loc: LocationType | 'All') => void;
    currentUser: User | null;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    handleLogout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
    villas,
    filterLocation,
    setFilterLocation,
    currentUser,
    theme,
    toggleTheme,
    handleLogout
}) => {

    const filteredVillas = filterLocation === 'All' ? villas : villas.filter(v => v.location === filterLocation);

    return (
        <div className="animate-fade-in min-h-screen flex flex-col">
            <Navbar currentUser={currentUser} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} />
            <FilterBar filterLocation={filterLocation} setFilterLocation={setFilterLocation} />

            <div className="max-w-7xl mx-auto px-6 py-12 flex-grow">
                <div className="space-y-12">
                    {filteredVillas.map(villa => (
                        <Link
                            to={`/villas/${villa.id}`}
                            key={villa.id}
                            className="block relative w-full h-[400px] md:h-[550px] rounded-3xl overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl transition-all duration-500"
                        >
                            <img src={villa.imageUrl} alt={villa.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-10 left-10 text-white right-10">
                                <h3 className="text-4xl md:text-5xl font-light lowercase tracking-tighter mb-2">{villa.name}</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm opacity-90 uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md px-3 py-1 rounded-md">{villa.location}</span>
                                    <div className="h-1 w-1 rounded-full bg-white opacity-40"></div>
                                    <span className="text-sm opacity-90 uppercase tracking-[0.2em]">{villa.bedrooms} Bedrooms</span>
                                </div>
                                <div className="mt-6 flex items-end gap-3">
                                    {villa.discountPrice && villa.discountPrice > 0 ? (
                                        <div className="flex flex-col">
                                            <span className="text-sm line-through opacity-50">IDR {villa.pricePerNight.toLocaleString()}</span>
                                            <p className="text-2xl font-bold">IDR {villa.discountPrice.toLocaleString()} <span className="text-sm font-light opacity-70">/ night</span></p>
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-bold">IDR {villa.pricePerNight.toLocaleString()} <span className="text-sm font-light opacity-70">/ night</span></p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                    {filteredVillas.length === 0 && (
                        <div className="text-center py-24 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                            <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                            <p className="text-xl text-gray-500">No villas found in this location.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
};
