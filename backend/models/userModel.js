const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (name, email, phone, password, role = 'user') => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
        'INSERT INTO users (name, email, phone, password, role, is_premium) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [name, email, phone, hashedPassword, role, true]
    );
    return result.rows[0].id;
};

const getUserByEmail = async (email) => {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
};

const getUserById = async (id) => {
    const { rows } = await db.query('SELECT id, name, email, phone, is_premium, role FROM users WHERE id = $1', [id]);
    return rows[0];
};

const saveResetToken = async (userId, tokenHash, expiry) => {
    await db.query(
        'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
        [tokenHash, expiry, userId]
    );
};

const getUserByResetToken = async (tokenHash) => {
    const { rows } = await db.query(
        'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
        [tokenHash]
    );
    return rows[0];
};

const updatePasswordAndClearToken = async (userId, hashedPassword) => {
    await db.query(
        'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
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

