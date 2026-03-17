require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, initializeDB } = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/risk', require('./routes/riskRoutes'));
app.use('/api/tracker', require('./routes/trackerRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Default route
app.get('/', (req, res) => {
    res.send('PCOS & Fertility PWA Backend API Server is running.');
});

const PORT = process.env.PORT || 5000;

// Initialize DB then start server
initializeDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server due to DB initialization error:', err);
});
