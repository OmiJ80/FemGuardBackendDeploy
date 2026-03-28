const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const nodemailer = require('nodemailer');

router.get('/', async (req, res) => {
    const healthCheck = {
        status: 'UP',
        timestamp: new Date(),
        services: {
            database: { status: 'UNKNOWN' },
            email: { status: 'UNKNOWN' }
        }
    };

    // 1. Check Database
    try {
        const dbStart = Date.now();
        await pool.query('SELECT 1');
        healthCheck.services.database = {
            status: 'CONNECTED',
            responseTime: `${Date.now() - dbStart}ms`
        };
    } catch (err) {
        healthCheck.status = 'DEGRADED';
        healthCheck.services.database = {
            status: 'DISCONNECTED',
            error: err.message,
            hint: process.env.DATABASE_URL === 'your_neon_db_url_here' ? 'Placeholder URL detected in .env' : 'Check your DATABASE_URL'
        };
    }

    // 2. Check Email (Shallow check)
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('EMAIL_USER or EMAIL_PASS missing in .env');
        }
        healthCheck.services.email = {
            status: 'CONFIGURED',
            user: process.env.EMAIL_USER
        };
    } catch (err) {
        healthCheck.status = 'DEGRADED';
        healthCheck.services.email = {
            status: 'MISCONFIGURED',
            error: err.message
        };
    }

    const statusCode = healthCheck.status === 'UP' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
});

module.exports = router;
