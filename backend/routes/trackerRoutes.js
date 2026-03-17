const express = require('express');
const router = express.Router();
const { submitCycle, getMyCycles } = require('../controllers/trackerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitCycle);
router.get('/', protect, getMyCycles);

module.exports = router;
