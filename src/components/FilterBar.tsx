import React from 'react';
import { LocationType } from '../types';

interface FilterBarProps {
    filterLocation: LocationType | 'All';
    setFilterLocation: (loc: LocationType | 'All') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filterLocation, setFilterLocation }) => {
    return (
        <div className="sticky top-20 z-[50] w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6 overflow-x-auto no-scrollbar">
                {['All', 'Puncak', 'Cileteuh', 'Bali'].map(loc => (
                    <button
                        key={loc}
                        onClick={() => setFilterLocation(loc as any)}
                        className={`text-base px-6 py-2 rounded-full transition-all whitespace-nowrap font-medium ${filterLocation === loc ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 shadow-md scale-105' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        {loc}
                    </button>
                ))}
            </div>
        </div>
    );
};
