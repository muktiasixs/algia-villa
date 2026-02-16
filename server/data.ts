export const INITIAL_VILLAS = [
    {
        id: 'v1',
        name: 'Agia Mountain Peak',
        location: 'Puncak',
        pricePerNight: 1500000,
        description: 'A serene escape in the misty mountains of Puncak. Features a heated pool and panoramic views.',
        imageUrl: '/images/villa-1.jpg',
        capacity: 10,
        bedrooms: 4,
        coordinates: [-6.7027, 106.9946] as [number, number]
    },
    {
        id: 'v2',
        name: 'Agia Forest Retreat',
        location: 'Puncak',
        pricePerNight: 1200000,
        description: 'Surrounded by pine trees, this cozy wooden villa is perfect for family gatherings.',
        imageUrl: '/images/villa-2.jpg',
        capacity: 6,
        bedrooms: 3,
        coordinates: [-6.7050, 106.9980] as [number, number]
    },
    {
        id: 'v3',
        name: 'Agia Waterfall Lodge',
        location: 'Cileteuh',
        pricePerNight: 1800000,
        description: 'Located near the Geopark waterfalls. Modern architecture meets nature.',
        imageUrl: '/images/villa-3.jpg',
        capacity: 8,
        bedrooms: 4,
        coordinates: [-7.1764, 106.4674] as [number, number]
    },
    {
        id: 'v4',
        name: 'Agia Ocean Breeze',
        location: 'Bali',
        pricePerNight: 3500000,
        description: 'Luxury beachfront villa with private infinity pool and staff.',
        imageUrl: '/images/villa-4.jpg',
        capacity: 12,
        bedrooms: 6,
        coordinates: [-8.4095, 115.1889] as [number, number]
    }
];

export const MOCK_ADMIN_USER = {
    id: 'admin_01',
    name: 'Agia Admin',
    email: 'admin@agia.com',
    role: 'admin',
    avatar: '/images/default-avatar.svg'
};

export const MOCK_NORMAL_USER = {
    id: 'user_01',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: '/images/default-avatar.svg'
};
