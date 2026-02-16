import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from "@google/genai";
import { INITIAL_VILLAS, MOCK_ADMIN_USER, MOCK_NORMAL_USER } from './data.ts';

const app = express();
const prisma = new PrismaClient();
const PORT = 3002;

// Initialize GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.use(cors());
app.use(bodyParser.json());

// Seed Database
async function seed() {
    try {
        console.log('Seeding database...');
        for (const v of INITIAL_VILLAS) {
            await prisma.villa.upsert({
                where: { id: v.id },
                update: {},
                create: {
                    id: v.id,
                    name: v.name,
                    location: v.location,
                    pricePerNight: v.pricePerNight,
                    description: v.description,
                    imageUrl: v.imageUrl,
                    capacity: v.capacity,
                    bedrooms: v.bedrooms,
                    latitude: v.coordinates[0],
                    longitude: v.coordinates[1]
                }
            });
        }
        // Create Users
        await prisma.user.upsert({
            where: { email: MOCK_ADMIN_USER.email },
            update: {},
            create: {
                id: MOCK_ADMIN_USER.id,
                name: MOCK_ADMIN_USER.name,
                email: MOCK_ADMIN_USER.email,
                role: MOCK_ADMIN_USER.role,
                avatar: MOCK_ADMIN_USER.avatar,
                password: 'password123'
            }
        });
        await prisma.user.upsert({
            where: { email: MOCK_NORMAL_USER.email },
            update: {},
            create: {
                id: MOCK_NORMAL_USER.id,
                name: MOCK_NORMAL_USER.name,
                email: MOCK_NORMAL_USER.email,
                role: MOCK_NORMAL_USER.role,
                avatar: MOCK_NORMAL_USER.avatar,
                password: 'password123'
            }
        });
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed();

// --- API Endpoints ---

// Utilities
app.post('/api/generate-description', async (req, res) => {
    const { name, location, features } = req.body;
    if (!genAI) {
        return res.json({ description: "AI not configured on server." });
    }
    try {
        const model = 'gemini-1.5-flash';
        const prompt = `Write a captivating, luxury real-estate description (max 100 words) for a villa named "${name}" located in ${location}. 
        Key features: ${features}. 
        Tone: Relaxing, inviting, premium.`;

        const response = await genAI.models.generateContent({
            model,
            contents: prompt,
        });
        res.json({ description: typeof response.text === 'function' ? response.text() : response.text });
    } catch (e) {
        console.error("GenAI Error", e);
        res.status(500).json({ error: "Failed to generate description" });
    }
});

// Villas
app.get('/api/villas', async (req, res) => {
    try {
        const villas = await prisma.villa.findMany();
        const formatted = villas.map(v => ({
            ...v,
            coordinates: [v.latitude, v.longitude]
        }));
        res.json(formatted);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.get('/api/villas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const villa = await prisma.villa.findUnique({ where: { id } });
        if (villa) {
            res.json({ ...villa, coordinates: [villa.latitude, villa.longitude] });
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.post('/api/villas', async (req, res) => {
    // Admin only logic effectively delegated to frontend for MVP, 
    // ideally check token here.
    const v = req.body;
    try {
        const newVilla = await prisma.villa.create({
            data: {
                name: v.name,
                location: v.location,
                pricePerNight: v.pricePerNight,
                discountPrice: v.discountPrice,
                description: v.description,
                imageUrl: v.imageUrl,
                capacity: v.capacity,
                bedrooms: v.bedrooms,
                latitude: v.coordinates ? v.coordinates[0] : 0,
                longitude: v.coordinates ? v.coordinates[1] : 0
            }
        });
        res.json(newVilla);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.delete('/api/villas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.villa.delete({ where: { id } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Bookings
app.get('/api/bookings/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.post('/api/bookings', async (req, res) => {
    const { userId, villaId, startDate, endDate, totalPrice } = req.body;
    try {
        const booking = await prisma.booking.create({
            data: {
                userId,
                villaId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPrice,
                status: 'confirmed' // Auto confirm for MVP
            }
        });
        res.json(booking);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Auth (Simple mock by email)
app.post('/api/login', async (req, res) => {
    const { email } = req.body; // In real app, password too
    try {
        // Special admin bypass check or just check role
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            res.json(user);
        } else {
            // For MVP, auto-create guest user if not exists? Or return error
            // Let's create guest user if valid email format
            if (email.includes('@')) {
                const newUser = await prisma.user.create({
                    data: {
                        email,
                        name: email.split('@')[0],
                        password: 'password123', // Default
                        role: 'user',
                        avatar: '/images/default-avatar.svg'
                    }
                });
                res.json(newUser);
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Reviews
app.get('/api/reviews', async (req, res) => {
    const { villaId } = req.query;
    try {
        const where = villaId ? { villaId: String(villaId) } : {};
        const reviews = await prisma.review.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, avatar: true } } } // Include user details if needed
        });
        res.json(reviews);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

app.post('/api/reviews', async (req, res) => {
    const { userId, villaId, rating, comment } = req.body;
    try {
        const review = await prisma.review.create({
            data: {
                userId,
                villaId,
                rating,
                comment
            }
        });
        // Update booking status if needed? 
        // Logic for "hasReviewed" on booking is tricky without bookingId.
        // For MVP, just create review.
        res.json(review);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
