const express = require('express');
const router = express.Router();
const { getUsers, getStats, downloadAnonymizedReports, sendNotification } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

const adminGuard = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

router.get('/users', protect, adminGuard, getUsers);
router.get('/stats', protect, adminGuard, getStats);
router.get('/reports/download', protect, adminGuard, downloadAnonymizedReports);
router.post('/notifications', protect, adminGuard, sendNotification);

module.exports = router;
