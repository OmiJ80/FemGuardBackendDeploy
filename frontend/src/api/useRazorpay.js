import { useNavigate } from 'react-router-dom';
import api from './axios';

export const useRazorpay = () => {
    const navigate = useNavigate();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (user) => {
        if (!user) return alert('Please login first!');

        const res = await loadRazorpayScript();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            // 1. Create order on backend
            const { data: order } = await api.post('/payment/create-order');

            // 2. Setup Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key_id',
                amount: order.amount,
                currency: order.currency,
                name: "DKPL's FEMGUARD",
                description: 'Premium Lifetime Upgrade',
                image: 'https://example.com/logo.png', // Add real logo URL later
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify payment on backend
                        await api.post('/payment/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        // Update local user state or refresh to show premium status
                        alert('Payment Successful! You are now a Premium user. Please re-login to see changes immediately.');
                        navigate('/dashboard');
                        window.location.reload(); // Quick way to refresh context for now
                    } catch (error) {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone,
                },
                theme: {
                    color: '#D81B60', // Matches tailwind 'primary' color
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Something went wrong creating the order.');
        }
    };

    return { handlePayment };
};
