const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    // Keep reliability settings for production environments
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
        rejectUnauthorized: false
    }
});

const sendPasswordResetEmail = async (toEmail, resetLink) => {
    const mailOptions = {
        from: `"FemGuard" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Reset Your FemGuard Password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="text-align:center; margin-bottom: 32px;">
                    <h1 style="background: linear-gradient(135deg, #F43F5E, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0;">FemGuard</h1>
                    <p style="color: #64748b; margin-top: 4px; font-size: 14px;">Your Reproductive Health Platform</p>
                </div>
                <h2 style="color: #1e293b; margin-bottom: 8px;">Reset Your Password</h2>
                <p style="color: #475569; line-height: 1.6;">
                    We received a request to reset the password for your FemGuard account. Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.
                </p>
                <div style="text-align: center; margin: 36px 0;">
                    <a href="${resetLink}" style="background: linear-gradient(135deg, #F43F5E, #8B5CF6); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #94a3b8; font-size: 13px;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="color: #cbd5e1; font-size: 12px; text-align: center;">
                    © ${new Date().getFullYear()} FemGuard Health. All rights reserved.
                </p>
            </div>
        `,
    };

    try {
        console.log(`Attempting to send reset email to: ${toEmail}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        console.error('Nodemailer Error:', error.message);
        if (error.code === 'EAUTH') {
            console.error('Authentication Error: Check your EMAIL_USER and EMAIL_PASS (App Password required for Gmail).');
        } else if (error.code === 'ESOCKET') {
            console.error('Connection Error: Check if the SMTP port is blocked by your hosting provider.');
        }
        throw new Error('Failed to send reset email: ' + error.message);
    }
};

module.exports = { sendPasswordResetEmail, transporter };
