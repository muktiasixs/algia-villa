import { Villa, User } from './types';

export const INITIAL_VILLAS: Villa[] = [
  {
    id: 'v1',
    name: 'Agia Mountain Peak',
    location: 'Puncak',
    pricePerNight: 1500000,
    description: 'A serene escape in the misty mountains of Puncak. Features a heated pool and panoramic views.',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    capacity: 10,
    bedrooms: 4,
    coordinates: [-6.7027, 106.9946]
  },
  {
    id: 'v2',
    name: 'Agia Forest Retreat',
    location: 'Puncak',
    pricePerNight: 1200000,
    description: 'Surrounded by pine trees, this cozy wooden villa is perfect for family gatherings.',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    capacity: 6,
    bedrooms: 3,
    coordinates: [-6.7050, 106.9980]
  },
  {
    id: 'v3',
    name: 'Agia Waterfall Lodge',
    location: 'Cileteuh',
    pricePerNight: 1800000,
    description: 'Located near the Geopark waterfalls. Modern architecture meets nature.',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    capacity: 8,
    bedrooms: 4,
    coordinates: [-7.1764, 106.4674]
  },
  {
    id: 'v4',
    name: 'Agia Ocean Breeze',
    location: 'Bali',
    pricePerNight: 3500000,
    description: 'Luxury beachfront villa with private infinity pool and staff.',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    capacity: 12,
    bedrooms: 6,
    coordinates: [-8.4095, 115.1889]
  }
];

export const MOCK_ADMIN_USER: User = {
  id: 'admin_01',
  name: 'Agia Admin',
  email: 'admin@agia.com',
  role: 'admin',
  avatar: 'https://picsum.photos/100/100?random=50'
};

export const MOCK_NORMAL_USER: User = {
  id: 'user_01',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  avatar: 'https://picsum.photos/100/100?random=51'
};
