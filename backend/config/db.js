const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initial connection without database selection to create it if it doesn't exist
const initializeDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        });

        console.log(`Checking if database ${process.env.DB_NAME} exists...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database ${process.env.DB_NAME} confirmed/created.`);

        // Switch to the newly created/existing database
        await connection.changeUser({ database: process.env.DB_NAME });

        // Read and execute schema
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            
            console.log('Dropping old assessments table for schema migration...');
            await connection.query('DROP TABLE IF EXISTS assessments;');

            // Split schema by simple statements (Note: this is a basic split, assumes simple SQL statements separated by ;)
            const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);

            console.log('Running database schema migrations...');
            for (let stmt of statements) {
                if (!stmt.toUpperCase().startsWith('USE')) {
                    await connection.query(stmt);
                }
            }
            console.log('Database schema migrations complete.');
        }

        await connection.end();

    } catch (error) {
        console.error('Failed to initialize database schema:', error);
    }
};

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB Connection
pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL Database via Pool.');
        connection.release();
    })
    .catch(err => {
        console.error('Database pool connection failed:', err);
    });

module.exports = { pool, initializeDB };
