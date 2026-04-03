const PDFDocument = require('pdfkit');
const riskModel = require('../models/riskModel');
const { getRecommendations } = require('../utils/ayurvedicLogic');

const drawSection = (doc, title, riskObj, color) => {
    doc.fillColor(color).fontSize(14).font('Helvetica-Bold').text(title);
    doc.moveTo(doc.x, doc.y).lineTo(doc.x + 100, doc.y).strokeColor(color).stroke().moveDown(0.5);
    
    doc.fillColor('#333333').fontSize(10).font('Helvetica').text(`Risk Score: `, { continued: true }).font('Helvetica-Bold').text(`${riskObj.score}`);
    doc.font('Helvetica').text(`Category: `, { continued: true }).font('Helvetica-Bold').text(`${riskObj.category}`);
    doc.moveDown(0.5);
    doc.fillColor('#666666').font('Helvetica-Oblique').text(`Ayurvedic Insight: "${riskObj.ayurvedic}"`);
    doc.moveDown(1.5);
};

const drawHeader = (doc, title, userName, userEmail, date) => {
    doc.fillColor('#2563EB').fontSize(24).font('Helvetica-Bold').text('FemGuard Report', { align: 'center' });
    doc.fontSize(10).fillColor('#666666').font('Helvetica').text(title, { align: 'center' }).moveDown(2);
    
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#eeeeee').stroke().moveDown(1);

    doc.fillColor('#333333').fontSize(12).font('Helvetica-Bold').text('User Information');
    doc.font('Helvetica').fontSize(10).text(`Name: ${userName}`);
    doc.text(`Email: ${userEmail}`);
    doc.text(`Report Date: ${date}`);
    doc.moveDown(2);
};

const drawFooter = (doc) => {
    doc.fontSize(8).fillColor('#999999').text('Disclaimer: This report is generated using an automated assessment tool based on Ayurvedic and Medical symptoms. It is meant for informational purposes only and does NOT constitute a medical diagnosis. It is not a substitute for professional medical advice.', { align: 'center' });
};

const downloadUserReport = async (req, res) => {
    try {
        const { id } = req.params;
        const assessment = await riskModel.getAssessmentById(id);

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        if (assessment.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to access this report' });
        }

        const pcosRisk = { score: assessment.pcos_score, category: assessment.pcos_category, ayurvedic: assessment.pcos_ayurvedic };
        const metabolicRisk = { score: assessment.metabolic_score, category: assessment.metabolic_category, ayurvedic: assessment.metabolic_ayurvedic };
        const infertilityRisk = { score: assessment.infertility_score, category: assessment.infertility_category, ayurvedic: assessment.infertility_ayurvedic };
        
        const recommendations = getRecommendations(pcosRisk, metabolicRisk, infertilityRisk);

        const doc = new PDFDocument({ margin: 50 });
        let filename = `FemGuard_Report_${assessment.user_name.replace(/\s+/g, '_')}.pdf`;
        
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        drawHeader(doc, 'Personalized PCOS & Fertility Risk Profile', assessment.user_name, assessment.user_email, new Date(assessment.created_at).toLocaleDateString('en-IN'));

        drawSection(doc, 'PCOS RISK PROFILE', pcosRisk, '#8800CC');
        drawSection(doc, 'METABOLIC SYNDROME RISK', metabolicRisk, '#CC6600');
        drawSection(doc, 'INFERTILITY RISK', infertilityRisk, '#CC0033');

        doc.addPage();
        doc.fillColor('#2563EB').fontSize(16).font('Helvetica-Bold').text('Ayurvedic Health Recommendations');
        doc.moveTo(50, doc.y).lineTo(300, doc.y).strokeColor('#2563EB').stroke().moveDown(1);
        
        doc.fillColor('#333333').fontSize(11).font('Helvetica').text(recommendations, {
            align: 'justify',
            lineGap: 5
        });

        doc.moveDown(3);
        drawFooter(doc);
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating PDF report', error: error.message });
    }
};

const downloadInstantPartialReport = async (req, res) => {
    try {
        const { module: moduleName, result } = req.body;
        const userName = req.user.name || 'User';
        const userEmail = req.user.email || '';

        if (!moduleName || !result) {
            return res.status(400).json({ message: 'Module type and result object are required.' });
        }

        const doc = new PDFDocument({ margin: 50 });
        const titleMap = {
            'pcos': 'PCOS Risk Profile',
            'metabolic': 'Metabolic Syndrome Risk',
            'infertility': 'Infertility Risk'
        };
        const colorMap = {
            'pcos': '#8800CC',
            'metabolic': '#CC6600',
            'infertility': '#CC0033'
        };

        const filename = `FemGuard_${moduleName.toUpperCase()}_Result.pdf`;
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        drawHeader(doc, `${titleMap[moduleName] || moduleName.toUpperCase()} - Partial Report`, userName, userEmail, new Date().toLocaleDateString('en-IN'));
        drawSection(doc, titleMap[moduleName] || moduleName.toUpperCase(), result, colorMap[moduleName] || '#333333');

        doc.moveDown(2);
        doc.fillColor('#446622').fontSize(12).font('Helvetica-Bold').text('Next Steps');
        doc.fillColor('#333333').fontSize(10).font('Helvetica').text('Continue the full assessment to receive a comprehensive Ayurvedic health plan and detailed recommendations.');

        doc.moveDown(4);
        drawFooter(doc);
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating partial PDF report' });
    }
};

module.exports = {
    downloadUserReport,
    downloadInstantPartialReport
};
