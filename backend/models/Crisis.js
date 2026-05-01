import mongoose from "mongoose";

const crisisSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    // 🔥 THE FIX: Added 'rescue', 'clothes', 'fire', and 'other'
    enum: ['food', 'medical', 'blood', 'shelter', 'rescue', 'clothes', 'fire', 'other'], 
    required: true 
  },
  location: { type: String, required: true },
  peopleCount: { type: Number, required: true },
  urgency: { type: String, required: true }, // AUTO GENERATED
  proof: { type: String }, // URL from Cloudinary
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected', 'in-progress', 'resolved'], 
    default: 'pending' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }); // Automatically handles createdAt

export default mongoose.model('Crisis', crisisSchema);