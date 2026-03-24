const db = require('../config/db');

const saveAssessment = async (userId, pcosRisk, metabolicRisk, infertilityRisk) => {
    const result = await db.query(
        `INSERT INTO assessments 
         (user_id, pcos_score, pcos_category, pcos_ayurvedic, metabolic_score, metabolic_category, metabolic_ayurvedic, infertility_score, infertility_category, infertility_ayurvedic) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
            userId, 
            pcosRisk.score, pcosRisk.category, pcosRisk.ayurvedic,
            metabolicRisk.score, metabolicRisk.category, metabolicRisk.ayurvedic,
            infertilityRisk.score, infertilityRisk.category, infertilityRisk.ayurvedic
        ]
    );
    return result.rows[0].id;
};

const getAssessmentsByUser = async (userId) => {
    const { rows } = await db.query('SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return rows;
};

module.exports = {
    saveAssessment,
    getAssessmentsByUser
};
