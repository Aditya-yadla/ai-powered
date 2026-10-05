const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { inMemoryStore, saveInMemoryStore } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_student_key_2026_safe', {
    expiresIn: '30d'
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter all fields: name, email, password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const emailLower = email.toLowerCase().trim();

    if (inMemoryStore.isFallback) {
      const exists = inMemoryStore.users.find((u) => u.email === emailLower);
      if (exists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email: emailLower,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };
      inMemoryStore.users.push(newUser);
      saveInMemoryStore();

      return res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        token: generateToken(newUser._id),
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      });
    }

    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: emailLower,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Registration Error' });
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const emailLower = email.toLowerCase().trim();

    if (inMemoryStore.isFallback) {
      const user = inMemoryStore.users.find((u) => u.email === emailLower);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      saveInMemoryStore();
      return res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }

    const user = await User.findOne({ email: emailLower });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Login Error' });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id || req.user.id,
      name: req.user.name,
      email: req.user.email
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
