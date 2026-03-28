const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');

const generateToken = (id, role, isPremium) => {
    return jwt.sign({ id, role, isPremium }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const userExists = await userModel.getUserByEmail(email);

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userId = await userModel.createUser(name, email, phone, password);

        res.status(201).json({
            _id: userId,
            name,
            email,
            phone,
            role: 'user',
            is_premium: true,
            token: generateToken(userId, 'user', true),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.getUserByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                is_premium: user.is_premium,
                role: user.role,
                token: generateToken(user.id, user.role, user.is_premium),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching user' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            // Return generic success to avoid user enumeration attacks
            return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await userModel.saveResetToken(user.id, resetTokenHash, resetTokenExpiry);

        // Determine frontend URL dynamically (useful for multiple environments)
        const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

        console.log(`Sending reset link for ${email}: ${resetLink}`);

        try {
            await sendPasswordResetEmail(user.email, resetLink);
        } catch (emailErr) {
            console.error('❌ Email sending failed. Error:', emailErr.message);
            return res.status(500).json({ 
                message: 'Failed to send reset email. Please contact support.',
                error: process.env.NODE_ENV === 'development' ? emailErr.message : undefined 
            });
        }

        res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (error) {
        console.error('❌ Forgot password CRITICAL error:', error.message);
        
        // Provide hint for common database connection issues
        if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo')) {
            console.error('💡 Hint: The backend cannot connect to the Database. Check your DATABASE_URL in .env.');
        }

        res.status(500).json({ message: 'Server error while processing forgot password request.' });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
        // Hash the incoming token to compare with stored hash
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await userModel.getUserByResetToken(resetTokenHash);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset link. Please request a new one.' });
        }

        // Hash the new password and update
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await userModel.updatePasswordAndClearToken(user.id, hashedPassword);

        res.json({ message: 'Password reset successful! You can now sign in with your new password.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword,
};
