import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // [cite: 101]
  message: { type: String, required: true }, // [cite: 102]
  type: { type: String }, // e.g., 'crisis_update', 'volunteer_assigned' [cite: 103]
  isRead: { type: Boolean, default: false } // [cite: 104]
}, { timestamps: true });


export default mongoose.model('Notification', notificationSchema);