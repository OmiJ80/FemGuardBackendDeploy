const db = require('../config/db');

const createPaymentRecord = async (userId, orderId, amount) => {
    const [result] = await db.pool.query(
        'INSERT INTO payments (user_id, razorpay_order_id, amount) VALUES (?, ?, ?)',
        [userId, orderId, amount]
    );
    return result.insertId;
};

const updatePaymentStatus = async (orderId, paymentId, status) => {
    await db.pool.query(
        'UPDATE payments SET razorpay_payment_id = ?, status = ? WHERE razorpay_order_id = ?',
        [paymentId, status, orderId]
    );
};

const upgradeUserToPremium = async (userId) => {
    await db.pool.query('UPDATE users SET is_premium = TRUE WHERE id = ?', [userId]);
}

module.exports = {
    createPaymentRecord,
    updatePaymentStatus,
    upgradeUserToPremium
};
