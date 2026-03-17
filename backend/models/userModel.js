const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (name, email, phone, password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.pool.query(
        'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
        [name, email, phone, hashedPassword]
    );
    return result.insertId;
};

const getUserByEmail = async (email) => {
    const [rows] = await db.pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const getUserById = async (id) => {
    const [rows] = await db.pool.query('SELECT id, name, email, phone, is_premium, role FROM users WHERE id = ?', [id]);
    return rows[0];
};

const saveResetToken = async (userId, tokenHash, expiry) => {
    await db.pool.query(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
        [tokenHash, expiry, userId]
    );
};

const getUserByResetToken = async (tokenHash) => {
    const [rows] = await db.pool.query(
        'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
        [tokenHash]
    );
    return rows[0];
};

const updatePasswordAndClearToken = async (userId, hashedPassword) => {
    await db.pool.query(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
        [hashedPassword, userId]
    );
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    saveResetToken,
    getUserByResetToken,
    updatePasswordAndClearToken,
};

