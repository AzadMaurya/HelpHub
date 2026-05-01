import express from 'express';
import { getUsers, deleteUser } from '../controllers/userController.js';
import { protectRoute, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protectRoute and adminOnly to all routes in this file
router.route('/')
  .get(protectRoute, adminOnly, getUsers);

router.route('/:id')
  .delete(protectRoute, adminOnly, deleteUser);

export default router;