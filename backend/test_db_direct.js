const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_9xuLP5dJytjp@ep-gentle-sky-a1ku18y9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('--- CONNECTION SUCCESSFUL ---');
        console.log('Server time:', res.rows[0].now);
        await pool.end();
    } catch (err) {
        console.error('--- CONNECTION FAILED ---');
        console.error(err.message);
        process.exit(1);
    }
}

testConnection();
