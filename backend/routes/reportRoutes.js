const express = require('express');
const router = express.Router();
const { downloadUserReport, downloadInstantPartialReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Route for downloading assessment report by ID
router.get('/download/:id', protect, downloadUserReport);

// Route for downloading instant partial report based on current session data
router.post('/download-instant-partial', protect, downloadInstantPartialReport);

module.exports = router;
