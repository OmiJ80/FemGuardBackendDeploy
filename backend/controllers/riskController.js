const riskModel = require('../models/riskModel');
const { calculatePCOS, calculateMetabolic, calculateInfertility, getRecommendations } = require('../utils/ayurvedicLogic');

const submitAssessment = async (req, res) => {
    try {
        const { answers } = req.body;
        // answers is expected to be an object containing exactly all the keys required by the 3 modules

        // Calculate all 3 modules
        const pcosRisk = calculatePCOS(answers);
        const metabolicRisk = calculateMetabolic(answers);
        const infertilityRisk = calculateInfertility(answers);

        // Get Aggregated Recommendations
        const recommendations = getRecommendations(pcosRisk, metabolicRisk, infertilityRisk);

        // Save to DB
        const assessmentId = await riskModel.saveAssessment(req.user.id, pcosRisk, metabolicRisk, infertilityRisk);

        res.status(201).json({
            assessmentId,
            pcosRisk,
            metabolicRisk,
            infertilityRisk,
            recommendations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error processing assessment', error: error.message, stack: error.stack });
    }
};

const getMyAssessments = async (req, res) => {
    try {
        const assessments = await riskModel.getAssessmentsByUser(req.user.id);
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching assessments' });
    }
};

module.exports = {
    submitAssessment,
    getMyAssessments
};
