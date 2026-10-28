import express from 'express';
import User from '../models/User.js';
import { generateToken, generateOTP } from '../utils/token.js';
import sendEmail from '../utils/email.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const otp = generateOTP();
    const user = await User.create({
      name, email, password,
      emailVerificationOTP: otp,
      emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 min
    });

    console.log(`\n🔑 EMAIL VERIFICATION OTP for ${email}: ${otp}\n`);
    
    await sendEmail({
      to: email,
      subject: 'Elvane Wear — Verify Your Email',
      html: `<div style="font-family:sans-serif;padding:40px;background:#FAFAFA;">
        <h2 style="color:#1A1A1A;">Welcome to Elvane Wear</h2>
        <p style="color:#2D2D2D;">Your verification code is:</p>
        <h1 style="color:#D4A76A;letter-spacing:8px;font-size:36px;">${otp}</h1>
        <p style="color:#6E6E6E;">This code expires in 10 minutes.</p>
      </div>`
    });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify Email OTP
router.post('/verify-email', protect, async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);
    
    if (user.isEmailVerified) return res.json({ message: 'Email already verified' });
    if (!user.emailVerificationOTP || user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }
    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully', user: { _id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: true } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resend OTP
router.post('/resend-otp', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isEmailVerified) return res.json({ message: 'Email already verified' });

    const otp = generateOTP();
    user.emailVerificationOTP = otp;
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`\n🔑 RESENT OTP for ${user.email}: ${otp}\n`);
    await sendEmail({
      to: user.email,
      subject: 'Elvane Wear — New Verification Code',
      html: `<div style="font-family:sans-serif;padding:40px;background:#FAFAFA;">
        <h2 style="color:#1A1A1A;">New Verification Code</h2>
        <h1 style="color:#D4A76A;letter-spacing:8px;font-size:36px;">${otp}</h1>
        <p style="color:#6E6E6E;">Expires in 10 minutes.</p>
      </div>`
    });

    res.json({ message: 'New OTP sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('wishlist');
  res.json(user);
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle wishlist
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.wishlist.indexOf(req.params.productId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(req.params.productId);
    }
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get wishlist
router.get('/wishlist', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist);
});

export default router;
