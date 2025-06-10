// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMyProfile,
    updateMyProfile
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile); // ✅ Protected route

module.exports = router;