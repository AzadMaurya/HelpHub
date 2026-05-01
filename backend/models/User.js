import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // [cite: 73]
  email: { type: String, required: true, unique: true }, // [cite: 74]
  password: { type: String, required: true }, // hashed [cite: 75]
  role: { 
    type: String, 
    enum: ['user', 'volunteer', 'admin', 'NGO'], 
    default: 'user' 
  }, // [cite: 76]
  phone: { type: String }, // [cite: 77]
  location: { type: String }, // [cite: 78]
  profileImage: { type: String } // [cite: 79]
}, { timestamps: true });

export default mongoose.model('User', userSchema);