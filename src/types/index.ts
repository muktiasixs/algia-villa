export type LocationType = 'Puncak' | 'Cileteuh' | 'Bali';

export interface Villa {
  id: string;
  name: string;
  location: LocationType;
  pricePerNight: number;
  discountPrice?: number; // Optional discounted price
  description: string;
  imageUrl: string;
  capacity: number;
  bedrooms: number;
  coordinates: [number, number]; // Latitude, Longitude
}

export interface Booking {
  id: string;
  villaId: string;
  userId: string;
  startDate: string; // ISO Date string
  endDate: string;   // ISO Date string
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  hasReviewed?: boolean; // Track if user has reviewed this booking
}

export interface Review {
  id: string;
  villaId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export type ViewState = 'HOME' | 'VILLA_DETAILS' | 'ADMIN_DASHBOARD' | 'LOGIN' | 'PROFILE' | 'MY_BOOKINGS';