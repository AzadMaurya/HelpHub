import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // [cite: 94]
  crisisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crisis' }, // [cite: 95]
  type: { 
    type: String, 
    enum: ['money', 'food', 'clothes', 'medicine'], 
    required: true 
  }, // [cite: 96]
  amount: { type: Number }, // amount/resource [cite: 97]
  proof: { type: String }, // [cite: 98]
  status: { type: String, default: 'pending' } // [cite: 99]
}, { timestamps: true });


export default mongoose.model('Donation', donationSchema);