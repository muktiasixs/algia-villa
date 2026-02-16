import axios from 'axios';
import { Villa, Booking, User, Review } from '../types';

const API_URL = 'http://localhost:3002/api';

export const ApiService = {
    getVillas: async (): Promise<Villa[]> => {
        const response = await axios.get(`${API_URL}/villas`);
        return response.data;
    },

    getVilla: async (id: string): Promise<Villa | null> => {
        try {
            const response = await axios.get(`${API_URL}/villas/${id}`);
            return response.data;
        } catch (e) {
            return null;
        }
    },

    saveVilla: async (villa: Villa): Promise<Villa> => {
        // Decide if create or update based on ID existence or check backend
        // For MVP, backend handles upsert or we split logic.
        // Simplified: always POST for create, separate PUT for update if needed.
        // But backend POST endpoint currently handles create.
        // Update endpoint likely needed.
        // For now, assume create new or replace.
        // Actually, let's use POST for create.
        // If ID exists on backend, it might duplicate or fail.
        // Let's implement CREATE only for now in Admin Dashboard for "Add".
        // For "Edit", we need PUT.
        // Assuming mostly Create for this demo.
        const response = await axios.post(`${API_URL}/villas`, villa);
        return response.data;
    },

    deleteVilla: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/villas/${id}`);
    },

    getUserBookings: async (userId: string): Promise<Booking[]> => {
        const response = await axios.get(`${API_URL}/bookings/user/${userId}`);
        return response.data;
    },

    createBooking: async (booking: Booking): Promise<Booking> => {
        const response = await axios.post(`${API_URL}/bookings`, booking);
        return response.data;
    },

    login: async (email: string): Promise<User | null> => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email });
            return response.data;
        } catch (e) {
            return null;
        }
    },

    getReviews: async (villaId: string): Promise<Review[]> => {
        const response = await axios.get(`${API_URL}/reviews?villaId=${villaId}`);
        return response.data;
    },

    addReview: async (review: Omit<Review, 'id' | 'createdAt' | 'userName'>): Promise<Review> => {
        const response = await axios.post(`${API_URL}/reviews`, review);
        return response.data;
    },

    generateDescription: async (name: string, location: string, features: string): Promise<string> => {
        try {
            const response = await axios.post(`${API_URL}/generate-description`, { name, location, features });
            return response.data.description;
        } catch (e) {
            return "Description unavailable.";
        }
    }
};
