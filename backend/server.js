require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool, initializeDB } = require('./config/db');

const app = express();

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security
app.disable('x-powered-by'); // Hide Express info

// Rate Limiting to prevent brute force
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'https://fem-guard-backend-deploy-z9jo-beige.vercel.app'],
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
