import Crisis from '../models/Crisis.js';
import { detectUrgency } from '../utils/urgencyDetector.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create new crisis
// @route   POST /api/crisis
// @access  Private (Logged in users)
export const createCrisis = async (req, res) => {
  try {
    const { title, description, category, location, peopleCount } = req.body;
    let proofUrl = '';

    // Handle Image Upload with Safety Checks
    if (req.file) {
      // SAFETY CHECK: Prevents the app from crashing if Multer is misconfigured
      if (!req.file.buffer) {
        throw new Error('Image upload failed: req.file.buffer is undefined. Please ensure Multer is using memoryStorage() in your routes.');
      }

      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'social-hub-crises'
      });
      proofUrl = uploadResponse.secure_url;
    }

    const urgency = detectUrgency(description, category, peopleCount);

    const crisis = new Crisis({
      title,
      description,
      category,
      location,
      peopleCount,
      urgency,
      proof: proofUrl, 
      createdBy: req.user._id 
    });

    const createdCrisis = await crisis.save();
    
    // Fetch the crisis again to populate creator details before emitting
    const populatedCrisis = await Crisis.findById(createdCrisis._id).populate('createdBy', 'name email');

    // SOCKET.IO EVENT: Emit new crisis to all connected clients safely
    const io = req.app.get('io');
    if (io) {
       io.emit('new_crisis', populatedCrisis);
    }

    res.status(201).json(populatedCrisis);
  } catch (error) {
    // 🛑 THIS PRINTS THE REAL ERROR TO YOUR VS CODE TERMINAL
    console.error("🔥 CRISIS CREATION ERROR:", error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all crises
// @route   GET /api/crisis
// @access  Public
export const getCrises = async (req, res) => {
  try {
    const crises = await Crisis.find({})
      .populate('createdBy', 'name email')
      .populate('assignedVolunteer', 'name email')
      .sort('-createdAt'); 
    res.json(crises);
  } catch (error) {
    console.error("🔥 GET CRISES ERROR:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get crisis by ID
// @route   GET /api/crisis/:id
// @access  Public
export const getCrisisById = async (req, res) => {
  try {
    const crisis = await Crisis.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedVolunteer', 'name email')
      .populate('verifiedBy', 'name');
      
    if (crisis) {
      res.json(crisis);
    } else {
      res.status(404).json({ message: 'Crisis not found' });
    }
  } catch (error) {
    console.error("🔥 GET CRISIS BY ID ERROR:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a crisis
// @route   PUT /api/crisis/:id
// @access  Private (Creator only)
export const updateCrisis = async (req, res) => {
  try {
    const crisis = await Crisis.findById(req.params.id);

    if (crisis) {
      if (crisis.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this crisis' });
      }

      crisis.title = req.body.title || crisis.title;
      crisis.description = req.body.description || crisis.description;
      crisis.category = req.body.category || crisis.category;
      crisis.location = req.body.location || crisis.location;
      crisis.peopleCount = req.body.peopleCount || crisis.peopleCount;

      if (req.body.description || req.body.category || req.body.peopleCount) {
         crisis.urgency = detectUrgency(crisis.description, crisis.category, crisis.peopleCount);
      }

      const updatedCrisis = await crisis.save();
      res.json(updatedCrisis);
    } else {
      res.status(404).json({ message: 'Crisis not found' });
    }
  } catch (error) {
    console.error("🔥 UPDATE CRISIS ERROR:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a crisis
// @route   DELETE /api/crisis/:id
// @access  Private (Creator or Admin)
export const deleteCrisis = async (req, res) => {
  try {
    const crisis = await Crisis.findById(req.params.id);

    if (crisis) {
      if (crisis.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
         return res.status(403).json({ message: 'Not authorized to delete this crisis' });
      }
      await crisis.deleteOne();
      res.json({ message: 'Crisis removed' });
    } else {
      res.status(404).json({ message: 'Crisis not found' });
    }
  } catch (error) {
    console.error("🔥 DELETE CRISIS ERROR:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify a crisis
// @route   PUT /api/crisis/verify/:id
// @access  Private (Admin only)
export const verifyCrisis = async (req, res) => {
  try {
    const crisis = await Crisis.findById(req.params.id);

    if (crisis) {
      crisis.status = 'verified';
      crisis.verifiedBy = req.user._id;
      const updatedCrisis = await crisis.save();
      res.json(updatedCrisis);
    } else {
      res.status(404).json({ message: 'Crisis not found' });
    }
  } catch (error) {
    console.error("🔥 VERIFY CRISIS ERROR:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Assign volunteer to crisis
// @route   PUT /api/crisis/assign/:id
// @access  Private (Volunteer/NGO)
export const assignVolunteer = async (req, res) => {
    try {
        const crisis = await Crisis.findById(req.params.id).populate('createdBy', 'name email');
        
        if (crisis) {
            crisis.assignedVolunteer = req.user._id;
            crisis.status = 'in-progress';
            const updatedCrisis = await crisis.save();
            
            const populatedUpdatedCrisis = await Crisis.findById(updatedCrisis._id)
              .populate('createdBy', 'name email')
              .populate('assignedVolunteer', 'name email');

            const io = req.app.get('io');
            if (io) io.emit('volunteer_assigned', populatedUpdatedCrisis);

            res.json(populatedUpdatedCrisis);
        } else {
            res.status(404).json({ message: 'Crisis not found' });
        }
    } catch (error) {
        console.error("🔥 ASSIGN VOLUNTEER ERROR:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark crisis as completed/resolved
// @route   PUT /api/crisis/complete/:id
// @access  Private (Assigned Volunteer or Admin)
export const completeCrisis = async (req, res) => {
    try {
        const crisis = await Crisis.findById(req.params.id);
        
        if (crisis) {
            crisis.status = 'resolved';
            const updatedCrisis = await crisis.save();

            const io = req.app.get('io');
            if (io) io.emit('crisis_resolved', updatedCrisis);

            res.json(updatedCrisis);
        } else {
            res.status(404).json({ message: 'Crisis not found' });
        }
    } catch (error) {
        console.error("🔥 COMPLETE CRISIS ERROR:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};