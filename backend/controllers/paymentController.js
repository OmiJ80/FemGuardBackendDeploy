const Razorpay = require('razorpay');
const crypto = require('crypto');
const paymentModel = require('../models/paymentModel');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

const createOrder = async (req, res) => {
    try {
        const options = {
            amount: 49900, // example amount in paise (₹499)
            currency: "INR",
            receipt: `receipt_order_${req.user.id}_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);

        await paymentModel.createPaymentRecord(req.user.id, order.id, 499);

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Razorpay order' });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            await paymentModel.updatePaymentStatus(razorpay_order_id, razorpay_payment_id, 'successful');

            // Upgrade user to Premium
            await paymentModel.upgradeUserToPremium(req.user.id);

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${frontendUrl}/dashboard?payment=success&reference=${razorpay_payment_id}`);
        } else {
            await paymentModel.updatePaymentStatus(razorpay_order_id, razorpay_payment_id, 'failed');
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during payment verification' });
    }
};

const debugUpgrade = async (req, res) => {
    try {
        await paymentModel.upgradeUserToPremium(req.user.id);
        res.json({ success: true, message: 'Upgraded to Premium (Debug Mode)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during debug upgrade' });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    debugUpgrade
};
