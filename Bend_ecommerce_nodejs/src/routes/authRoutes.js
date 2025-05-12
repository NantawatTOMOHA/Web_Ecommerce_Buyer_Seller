const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, updateProfile  } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authenticateToken, getProfile);
router.put('/updateProfile', authenticateToken, updateProfile);

module.exports = router;
