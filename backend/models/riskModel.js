const db = require('../config/db');

const saveAssessment = async (userId, pcosRisk, metabolicRisk, infertilityRisk) => {
    const [result] = await db.pool.query(
        `INSERT INTO assessments 
         (user_id, pcos_score, pcos_category, pcos_ayurvedic, metabolic_score, metabolic_category, metabolic_ayurvedic, infertility_score, infertility_category, infertility_ayurvedic) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId, 
            pcosRisk.score, pcosRisk.category, pcosRisk.ayurvedic,
            metabolicRisk.score, metabolicRisk.category, metabolicRisk.ayurvedic,
            infertilityRisk.score, infertilityRisk.category, infertilityRisk.ayurvedic
        ]
    );
    return result.insertId;
};

const getAssessmentsByUser = async (userId) => {
    const [rows] = await db.pool.query('SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
};

module.exports = {
    saveAssessment,
    getAssessmentsByUser
};
