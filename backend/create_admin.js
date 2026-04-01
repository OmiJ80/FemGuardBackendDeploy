const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function createAdmin() {
    try {
        await db.initializeDB();
        
        const name = process.env.ADMIN_NAME || "Admin User";
        const email = process.env.ADMIN_EMAIL || "admin@example.com";
        const password = process.env.ADMIN_PASSWORD || "adminpassword123";
        const phone = process.env.ADMIN_PHONE || "1234567890";
        
        // Check if admin already exists
        const { rows } = await db.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            console.log("Admin user already exists. Login with credentials:");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.pool.query(
            'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5)',
            [name, email, hashedPassword, phone, 'admin']
        );

        console.log("SUCCESS! Admin user created.");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch (error) {
        console.error("Failed to create admin:", error);
    } finally {
        process.exit(0);
    }
}

createAdmin();
