const db = require('../config/db');

const getAllUsers = async () => {
    const [rows] = await db.pool.query('SELECT id, name, email, phone, is_premium, created_at FROM users WHERE role = "user" ORDER BY created_at DESC');
    return rows;
};

const getRiskStatistics = async () => {
    // We will aggregate stats specifically by PCOS Risk Category for the primary dashboard chart
    const [rows] = await db.pool.query('SELECT pcos_category as risk_category, COUNT(*) as count FROM assessments GROUP BY pcos_category');
    return rows;
};

const getAllAssessments = async () => {
    const [rows] = await db.pool.query(`
    SELECT a.id, u.name, u.email, 
           a.pcos_score, a.pcos_category, a.pcos_ayurvedic,
           a.metabolic_score, a.metabolic_category, a.metabolic_ayurvedic,
           a.infertility_score, a.infertility_category, a.infertility_ayurvedic,
           a.created_at
    FROM assessments a
    JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
  `);
    return rows;
}

module.exports = {
    getAllUsers,
    getRiskStatistics,
    getAllAssessments
};
