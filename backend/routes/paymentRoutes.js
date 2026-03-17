const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, debugUpgrade } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment); // Actually might not need protect if it is a webhook, but kept protect for frontend call
router.post('/debug-upgrade', protect, debugUpgrade);

module.exports = router;
