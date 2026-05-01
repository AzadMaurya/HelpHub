import express from 'express';
import { broadcastToArea } from '../controllers/adminController.js';
import { protectRoute, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only Admins can access this endpoint
router.post('/broadcast', protectRoute, adminOnly, broadcastToArea);

export default router;