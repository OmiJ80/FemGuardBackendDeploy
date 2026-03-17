const express = require('express');
const router = express.Router();
const { submitAssessment, getMyAssessments } = require('../controllers/riskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitAssessment);
router.get('/', protect, getMyAssessments);

module.exports = router;
