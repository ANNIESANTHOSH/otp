const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// In-memory OTP storage (you can replace this with a database if needed)
const otpStore = {};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465,  // true for 465, false for other ports (587 or 25)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Verify SMTP connection
transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

// Route to send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  // Check if email is valid
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Generate OTP and expiration time
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
  console.log(`OTP: ${otp}, Expires At: ${otpExpiresAt}`);

  try {
    // Store OTP and expiration in memory (or database)
    otpStore[email] = { otp, otpExpiresAt };

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });

    res.json({ message: 'OTP sent to your email' });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP. Please try again later.' });
  }
});

// Route to verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    // Check if OTP exists for the email
    const userOtp = otpStore[email];

    if (!userOtp) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if OTP matches and is not expired
    if (userOtp.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > userOtp.otpExpiresAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // OTP verified successfully
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP. Please try again later.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
