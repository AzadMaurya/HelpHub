import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import crisisRoutes from './routes/crisisRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Global Socket Access
app.set('io', io);

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://help-hub-01.vercel.app/" // Add your actual Vercel URL here
  ],
  credentials: true
}));
app.use(express.json());

// Database Connection Logic (Optimized for Serverless)
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Ensure DB is connected for every request on Vercel
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/crisis', crisisRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('HelpHub API is running...');
});

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// EXPORT FOR VERCEL
export default app;

// LOCAL DEVELOPMENT ONLY
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}