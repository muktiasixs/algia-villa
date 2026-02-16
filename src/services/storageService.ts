import { Villa, Booking, User, Review } from '../types';
import { INITIAL_VILLAS } from '../constants';

const VILLA_KEY = 'agia_villas';
const BOOKING_KEY = 'agia_bookings';
const USERS_KEY = 'agia_users';
const REVIEWS_KEY = 'agia_reviews';

export const StorageService = {
  // --- Villa Management ---
  getVillas: (): Villa[] => {
    const stored = localStorage.getItem(VILLA_KEY);
    if (!stored) {
      localStorage.setItem(VILLA_KEY, JSON.stringify(INITIAL_VILLAS));
      return INITIAL_VILLAS;
    }
    return JSON.parse(stored);
  },

  saveVilla: (villa: Villa) => {
    const villas = StorageService.getVillas();
    const index = villas.findIndex(v => v.id === villa.id);
    if (index >= 0) {
      villas[index] = villa;
    } else {
      villas.push(villa);
    }
    localStorage.setItem(VILLA_KEY, JSON.stringify(villas));
  },

  deleteVilla: (id: string) => {
    const villas = StorageService.getVillas().filter(v => v.id !== id);
    localStorage.setItem(VILLA_KEY, JSON.stringify(villas));
  },

  // --- Booking Management ---
  getBookings: (): Booking[] => {
    const stored = localStorage.getItem(BOOKING_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getUserBookings: (userId: string): Booking[] => {
    const allBookings = StorageService.getBookings();
    return allBookings.filter(b => b.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createBooking: (booking: Booking): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = StorageService.getBookings();
        bookings.push(booking);
        localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
        resolve(true);
      }, 1000); // Simulate network delay
    });
  },

  markBookingAsReviewed: (bookingId: string) => {
    const bookings = StorageService.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
        bookings[index].hasReviewed = true;
        localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
    }
  },

  // Check if dates overlap with existing confirmed bookings
  isDateRangeAvailable: (villaId: string, startDate: string, endDate: string): boolean => {
    // Only check against confirmed bookings
    const bookings = StorageService.getBookings().filter(b => b.villaId === villaId && b.status === 'confirmed');
    
    // Normalize dates to midnight to ensure accurate comparison
    const reqStart = new Date(startDate);
    reqStart.setHours(0,0,0,0);
    const reqEnd = new Date(endDate);
    reqEnd.setHours(0,0,0,0);

    return !bookings.some(booking => {
      const bStart = new Date(booking.startDate);
      bStart.setHours(0,0,0,0);
      const bEnd = new Date(booking.endDate);
      bEnd.setHours(0,0,0,0);

      // Overlap logic: (StartA <= EndB) and (EndA >= StartB)
      return (reqStart < bEnd && reqEnd > bStart);
    });
  },

  // --- User Management ---
  saveUser: (user: User) => {
    const usersStr = localStorage.getItem(USERS_KEY);
    let users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUser: (id: string): User | undefined => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    return users.find(u => u.id === id);
  },

  // --- Review Management ---
  getReviews: (villaId?: string): Review[] => {
    const stored = localStorage.getItem(REVIEWS_KEY);
    const allReviews: Review[] = stored ? JSON.parse(stored) : [];
    if (villaId) {
        return allReviews.filter(r => r.villaId === villaId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return allReviews;
  },

  addReview: (review: Review, bookingId: string) => {
    const reviews = StorageService.getReviews();
    reviews.push(review);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    StorageService.markBookingAsReviewed(bookingId);
  },

  getAverageRating: (villaId: string): { rating: number, count: number } => {
    const reviews = StorageService.getReviews(villaId);
    if (reviews.length === 0) return { rating: 0, count: 0 };
    
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return {
        rating: parseFloat((sum / reviews.length).toFixed(1)),
        count: reviews.length
    };
  }
};