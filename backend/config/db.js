const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// PostgreSQL connection configuration
// Use DATABASE_URL if provided, else use individual components
const poolConfig = process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
        ssl: { rejectUnauthorized: false }
    };

const pool = new Pool(poolConfig);

// Initial connection to run schema if needed
const initializeDB = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('Connected to PostgreSQL Database.');

        // Read and execute schema
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            
            console.log('Running database schema migrations...');
            // Split schema by semicolon and execute each statement
            const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);

            for (let stmt of statements) {
                try {
                    await client.query(stmt);
                } catch (stmtError) {
                    console.error(`Error executing statement: ${stmt.substring(0, 50)}...`, stmtError.message);
                }
            }
            console.log('Database schema migrations complete.');
        }

    } catch (error) {
        console.error('Failed to initialize database schema:', error);
    } finally {
        if (client) client.release();
    }
};

// Test DB Connection
pool.connect()
    .then(client => {
        console.log('Successfully connected to Neon/Postgres via Pool.');
        client.release();
    })
    .catch(err => {
        console.error('Database pool connection failed:', err);
    });

module.exports = { 
    pool, 
    initializeDB,
    query: (text, params) => pool.query(text, params)
};
