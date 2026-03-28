require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool, initializeDB } = require('./config/db');

const app = express();

// --- 1. CORS Configuration (सर्वात आधी ठेवा) ---
app.use(cors({
    origin: function (origin, callback) {
        // सर्व origins ला परवानगी द्या किंवा ठराविक लिस्ट तपासा
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'https://fem-guard-backend-deploy-z9jo-beige.vercel.app',
            'https://fem-guard-deploy.vercel.app',
            'http://localhost:5173'
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("CORS Blocked for origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// --- 2. Security Middleware ---
app.use(helmet()); 
app.disable('x-powered-by'); 

// Render साठी प्रॉक्सी ट्रस्ट
app.set('trust proxy', 1);

// --- 3. Rate Limiting ---
 const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, 
     max: 100, 
     message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
 });
 app.use('/api/', limiter);
 
 // --- 4. Standard Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 5. Routes ---
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
