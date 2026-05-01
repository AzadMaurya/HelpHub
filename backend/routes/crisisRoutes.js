import express from 'express';
import { 
  createCrisis, 
  getCrises, 
  getCrisisById, 
  updateCrisis, 
  deleteCrisis, 
  verifyCrisis, 
  assignVolunteer, 
  completeCrisis 
} from '../controllers/crisisController.js';
import { protectRoute, adminOnly, roleBasedAccess } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Base routes (/api/crisis)
router.route('/')
  .post(protectRoute, upload.single('image'), createCrisis)
  .get(getCrises);

// Specific crisis routes (/api/crisis/:id)
router.route('/:id')
  .get(getCrisisById)
  .put(protectRoute, updateCrisis)
  .delete(protectRoute, deleteCrisis);

// Admin verification route
router.route('/verify/:id')
  .put(protectRoute, adminOnly, verifyCrisis);

// Volunteer/NGO assignment route
router.route('/assign/:id')
  .put(protectRoute, roleBasedAccess('volunteer', 'NGO', 'admin'), assignVolunteer);

// Completion route
router.route('/complete/:id')
  .put(protectRoute, completeCrisis);

export default router;