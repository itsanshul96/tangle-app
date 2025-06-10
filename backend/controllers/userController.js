// controllers/userController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
exports.registerUser = async (req, res) => {
  const { name, email, password, age, gender, intent } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      intent,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
exports.getMyProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      intent: user.intent,
    });
  } catch (error) {
    console.error("PROFILE FETCH ERROR:", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMyProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fields that can be updated
    const { name, age, gender, intent } = req.body;

    // Only update if value is provided
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (intent) user.intent = intent;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      gender: updatedUser.gender,
      intent: updatedUser.intent,
    });
  } catch (error) {
    console.error('UPDATE ERROR:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


