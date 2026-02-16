import React, { useState } from 'react';
import { Villa, LocationType, User } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/apiService';

interface AdminDashboardPageProps {
    villas: Villa[];
    setVillas: React.Dispatch<React.SetStateAction<Villa[]>>;
    currentUser: User | null;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    handleLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
    villas,
    setVillas,
    currentUser,
    theme,
    toggleTheme,
    handleLogout
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Villa>>({});
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    const handleAdminSave = async () => {
        if (!editForm.name || !editForm.pricePerNight) return;
        const villaToSave: Villa = {
            id: editForm.id || `v_${Date.now()}`,
            name: editForm.name || '',
            location: (editForm.location as LocationType) || 'Puncak',
            pricePerNight: Number(editForm.pricePerNight),
            discountPrice: Number(editForm.discountPrice) || 0,
            description: editForm.description || '',
            imageUrl: editForm.imageUrl || `https://picsum.photos/800/600?random=${Date.now()}`,
            capacity: Number(editForm.capacity) || 2,
            bedrooms: Number(editForm.bedrooms) || 1,
            coordinates: editForm.coordinates || [-6.7027, 106.9946]
        };
        try {
            await ApiService.saveVilla(villaToSave);
            const data = await ApiService.getVillas();
            setVillas(data); // Reload from storage
            setIsEditing(false);
            setEditForm({});
        } catch (e) {
            alert('Failed to save');
        }
    };

    const handleAdminDelete = async (id: string) => {
        if (window.confirm('Delete this villa?')) {
            try {
                await ApiService.deleteVilla(id);
                const data = await ApiService.getVillas();
                setVillas(data);
            } catch (e) {
                alert('Failed to delete');
            }
        }
    };

    const handleGenerateDescription = async () => {
        if (!editForm.name || !editForm.location) return;
        setIsGeneratingAI(true);
        const desc = await ApiService.generateDescription(editForm.name, typeof editForm.location === 'string' ? editForm.location : 'Puncak', `Bedrooms: ${editForm.bedrooms}, Capacity: ${editForm.capacity}`);
        setEditForm(prev => ({ ...prev, description: desc }));
        setIsGeneratingAI(false);
    };

    return (
        <div className="animate-fade-in min-h-screen flex flex-col">
            <Navbar currentUser={currentUser} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} />
            <div className="max-w-7xl mx-auto px-6 py-16 flex-grow">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-light dark:text-white tracking-tighter lowercase">Admin Dashboard</h1>
                    <button onClick={() => { setIsEditing(true); setEditForm({}); }} className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-8 py-3 rounded-2xl text-base font-bold shadow-lg hover:shadow-xl transition-all">Add New Villa</button>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-700">
                            <h2 className="text-2xl font-bold mb-8 dark:text-white lowercase tracking-tight">Villa Configuration</h2>
                            {/* Form fields */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Villa Name</label>
                                    <input placeholder="Ex: Agia Ocean" className="w-full p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-4 focus:ring-brand-500/20 text-lg" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Location</label>
                                    <select className="w-full p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-4 focus:ring-brand-500/20 text-lg" value={editForm.location || 'Puncak'} onChange={e => setEditForm({ ...editForm, location: e.target.value as any })}>
                                        <option value="Puncak">Puncak</option><option value="Cileteuh">Cileteuh</option><option value="Bali">Bali</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Price per Night</label>
                                    <input type="number" placeholder="IDR" className="w-full p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-4 focus:ring-brand-500/20 text-lg" value={editForm.pricePerNight || ''} onChange={e => setEditForm({ ...editForm, pricePerNight: Number(e.target.value) })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Special Discount Price</label>
                                    <div className="flex gap-4">
                                        <input type="number" placeholder="Discount Price" className="flex-grow p-4 border border-red-200 rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg" value={editForm.discountPrice || ''} onChange={e => setEditForm({ ...editForm, discountPrice: Number(e.target.value) })} />
                                        <select className="p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white font-bold" onChange={e => {
                                            const pct = Number(e.target.value);
                                            if (editForm.pricePerNight) setEditForm({ ...editForm, discountPrice: pct === 0 ? 0 : Math.round(editForm.pricePerNight * (1 - pct / 100)) });
                                        }}>
                                            <option value="0">Off</option><option value="10">10%</option><option value="20">20%</option><option value="50">50%</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL</label>
                                    <input placeholder="https://..." className="w-full p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg" value={editForm.imageUrl || ''} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} />
                                </div>
                            </div>
                            <div className="mb-10">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Description</label>
                                    <button onClick={handleGenerateDescription} disabled={isGeneratingAI} className="text-xs font-bold bg-brand-600 text-white px-3 py-1.5 rounded-full hover:bg-brand-700 transition-colors flex items-center gap-2">
                                        <i className="fas fa-magic"></i> {isGeneratingAI ? 'Writing...' : 'AI Generate'}
                                    </button>
                                </div>
                                <textarea rows={4} className="w-full p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg" value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-6 pt-8 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-base font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Cancel</button>
                                <button onClick={handleAdminSave} className="px-10 py-3 text-base bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">Save Villa</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-2xl">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Villa Collection</th>
                                <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Location</th>
                                <th className="px-8 py-6 text-right text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Current Price</th>
                                <th className="px-8 py-6 text-right text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {villas.map(v => (
                                <tr key={v.id} className="dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-8 py-6 flex items-center gap-4">
                                        <img src={v.imageUrl} className="w-16 h-12 rounded-xl object-cover shadow-sm" />
                                        <span className="font-bold text-lg">{v.name}</span>
                                    </td>
                                    <td className="px-8 py-6 text-base font-medium text-gray-500">{v.location}</td>
                                    <td className="px-8 py-6 text-right font-bold text-lg">IDR {v.discountPrice ? v.discountPrice.toLocaleString() : v.pricePerNight.toLocaleString()}</td>
                                    <td className="px-8 py-6 text-right">
                                        <button onClick={() => { setEditForm(v); setIsEditing(true); }} className="text-blue-500 font-bold hover:underline mr-6">Edit</button>
                                        <button onClick={() => handleAdminDelete(v.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
};
