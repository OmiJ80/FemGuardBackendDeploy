require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, initializeDB } = require('./config/db');

const app = express();

// Middleware
app.use(cors({
    origin: ['https://fem-guard-backend-deploy-z9jo-beige.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/risk', require('./routes/riskRoutes'));
app.use('/api/tracker', require('./routes/trackerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Default route
app.get('/', (req, res) => {
    res.send('PCOS & Fertility PWA Backend API Server is running.');
});

const PORT = process.env.PORT || 5000;

// Export app for serverless environments (Vercel)
module.exports = app;

// Only listen if this file is run directly (not as a serverless function)
if (require.main === module) {
    initializeDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Failed to start server due to DB initialization error:', err);
    });
}
