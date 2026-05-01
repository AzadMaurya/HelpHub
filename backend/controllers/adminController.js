import User from '../models/User.js';
import nodemailer from 'nodemailer';

// @desc    Broadcast email to all users in a specific area
// @route   POST /api/admin/broadcast
// @access  Private/Admin
export const broadcastToArea = async (req, res) => {
  const { location, message, subject } = req.body;

  try {
    // 1. Find users in the specific location (case-insensitive)
    const users = await User.find({ 
      location: { $regex: new RegExp(location, 'i') } 
    }).select('email');

    if (users.length === 0) {
      return res.status(404).json({ message: `No users found registered in ${location}` });
    }

    // 2. Configure Nodemailer with 2026 Security Standards
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Your 16-character App Password
      },
      tls: {
        rejectUnauthorized: false // Helps avoid local certificate errors
      }
    });

    // 3. Prepare the email list (BCC for privacy)
    const emailList = users.map(user => user.email);

    const mailOptions = {
      from: `"Social Hub Alerts" <${process.env.EMAIL_USER}>`,
      bcc: emailList, 
      subject: subject || `Urgent Update for ${location}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #dc3545;">Emergency Alert: ${location}</h2>
          <p style="font-size: 16px; line-height: 1.6;">${message}</p>
          <hr />
          <p style="font-size: 12px; color: #777;">You received this because you are a registered user in ${location}.</p>
        </div>
      `
    };

    // 4. Send the Email
    await transporter.sendMail(mailOptions);

    res.json({ message: `Broadcast successfully sent to ${users.length} users in ${location}.` });
  } catch (error) {
    console.error("Broadcast Error:", error);
    res.status(500).json({ message: 'Failed to dispatch emails', error: error.message });
  }
};