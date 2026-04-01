require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool, initializeDB } = require('./config/db');

const app = express();

// --- 1. Security & CORS Configuration ---
// Move CORS to the extreme top to ensure it handles all requests including preflights
const allowedOrigins = [
  'https://fem-guard-backend-deploy-z9jo-beige.vercel.app',
  'https://fem-guard-deploy.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.FRONTEND_URL
].filter(Boolean).map(o => o.replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`CORS Blocked for: ${origin}`);
      // Don't pass an error to the callback, just block it by passing false
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

// Configure Helmet to allow cross-origin requests
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
})); 

// --- 2. Security Middleware ---
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
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/reports', require('./routes/reportRoutes')); // Added report routes here

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
