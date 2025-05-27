const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.createUser);
router.post('/logout', authController.logout);
router.get('/me', authController.authenticateToken, authController.getMe);

router.get('/admin', authenticateToken, requireRole('admin'), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}` });
});

router.get('/user', authenticateToken, requireRole('user'), (req, res) => {
  res.json({ message: `Welcome User ${req.user.username}` });
});

module.exports = router;
