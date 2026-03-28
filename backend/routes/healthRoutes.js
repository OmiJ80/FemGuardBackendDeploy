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

    // 2. Check Email (Shallow + Live check)
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('EMAIL_USER or EMAIL_PASS missing in .env');
        }

        // Attempt a live verification with the SMTP server
        const verifyPromise = new Promise((resolve, reject) => {
            const transporter = require('../utils/emailService').transporter || require('nodemailer').createTransport({
                service: 'gmail',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            });
            transporter.verify((error, success) => {
                if (error) reject(error);
                else resolve(success);
            });
        });

        // Timeout verification after 5 seconds
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP Verification Timeout')), 5000));
        
        await Promise.race([verifyPromise, timeout]);

        healthCheck.services.email = {
            status: 'CONNECTED',
            user: process.env.EMAIL_USER
        };
    } catch (err) {
        healthCheck.status = 'DEGRADED';
        healthCheck.services.email = {
            status: 'FAILED',
            error: err.message,
            code: err.code,
            hint: err.code === 'EAUTH' ? 'Check if EMAIL_PASS is a valid 16-character App Password and 2FA is enabled.' : 'Google might be blocking the connection from Render.'
        };
    }

    const statusCode = healthCheck.status === 'UP' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
});

module.exports = router;
