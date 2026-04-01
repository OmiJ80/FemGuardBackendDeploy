const express = require('express');
const router = express.Router();
const { submitAssessment, getMyAssessments, calculatePartial } = require('../controllers/riskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitAssessment);
router.post('/calculate-partial', protect, calculatePartial);
router.get('/', protect, getMyAssessments);

module.exports = router;
