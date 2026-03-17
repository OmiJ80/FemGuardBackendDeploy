const adminModel = require('../models/adminModel');

const getUsers = async (req, res) => {
    try {
        const users = await adminModel.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await adminModel.getRiskStatistics();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

const downloadAnonymizedReports = async (req, res) => {
    try {
        const assessments = await adminModel.getAllAssessments();

        let csv = 'ID,PCOS_Score,PCOS_Risk,Metabolic_Score,Metabolic_Risk,Infertility_Score,Infertility_Risk,Created_At\n';
        assessments.forEach(a => {
            // Anonymized = no name, no email
            csv += `${a.id},${a.pcos_score},${a.pcos_category},${a.metabolic_score},${a.metabolic_category},${a.infertility_score},${a.infertility_category},${a.created_at}\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('anonymized_femguard_reports.csv');
        return res.send(csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating reports' });
    }
};

// Send notifications would usually be integrated with Firebase Cloud Messaging
const sendNotification = async (req, res) => {
    try {
        const { title, body } = req.body;
        // Example: send using firebase admin SDK
        console.log(`Sending Notification: ${title} - ${body}`);
        res.json({ message: 'Notification scheduled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending notification' });
    }
};

module.exports = {
    getUsers,
    getStats,
    downloadAnonymizedReports,
    sendNotification
};
