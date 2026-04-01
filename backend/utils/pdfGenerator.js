const PDFDocument = require('pdfkit');

const generatePDFReport = (user, assessment, res) => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=FemGuard_Report_${user.name.replace(' ', '_')}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(22).fillColor('#D81B60').text('FemGuard Advanced Risk Assessment Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('gray').text('Early Identification of PCOS, Infertility Risk and Metabolic Syndrome', { align: 'center' });
    doc.moveDown(2);

    // User Details
    doc.fillColor('black').fontSize(14).text(`Patient Information`, { underline: true });
    doc.fontSize(12).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Date of Assessment: ${new Date(assessment.created_at).toLocaleDateString()}`);
    doc.moveDown(2);

    // Helper to draw module box
    const drawModule = (title, score, max, category, ayurvedic) => {
        doc.fontSize(16).fillColor('#D81B60').text(title, { underline: true });
        doc.moveDown(0.5);
        
        doc.fontSize(12).fillColor('black').text(`Risk Score: `, { continued: true }).text(`${score} / ${max}`, { bold: true });
        
        let catColor = category.includes('Low') ? 'green' : category.includes('Moderate') ? 'orange' : 'red';
        doc.text(`Category: `, { continued: true }).fillColor(catColor).text(category, { bold: true });
        
        doc.fillColor('black').text(`Ayurvedic Interpretation: ${ayurvedic}`);
        doc.moveDown(1.5);
    };

    // PCOS Risk
    drawModule('1. PCOS Risk Module', assessment.pcos_score, 17, assessment.pcos_category, assessment.pcos_ayurvedic);

    // Metabolic Risk
    drawModule('2. Metabolic Syndrome Risk Module', assessment.metabolic_score, 17, assessment.metabolic_category, assessment.metabolic_ayurvedic);

    // Infertility Risk
    drawModule('3. Infertility Risk Module', assessment.infertility_score, 18, assessment.infertility_category, assessment.infertility_ayurvedic);

    // Premium Recommendations
    doc.addPage();
    doc.fontSize(18).fillColor('#D81B60').text('Personalized Care & Recommendations', { underline: true });
    doc.moveDown();
    
    doc.fontSize(12).fillColor('black');
    
    if (assessment.pcos_category.includes('High') || assessment.infertility_category.includes('High')) {
        doc.text('• Medical Consultation: We strongly recommend scheduling an appointment with a gynecologist or a fertility specialist.');
    }
    if (assessment.metabolic_category.includes('High')) {
        doc.text('• Endocrinologist Alert: High metabolic risk detected. Please consult an endocrinologist for diabetes (Premeha) screening.');
    }
    
    doc.moveDown(1);
    doc.text('• Diet & Lifestyle Plan:');
    doc.text('  - Focus on a low glycemic index diet rich in whole grains and fresh vegetables.');
    doc.text('  - Incorporate daily cardiovascular exercise (at least 30 mins) to manage Kapha-Medo imbalances.');
    doc.text('  - Practice Yoga specifically targeted for reproductive health (e.g., Surya Namaskar, Baddha Konasana).');
    
    doc.moveDown(2);
    
    // Footer / Disclaimer
    doc.fontSize(10).fillColor('gray').text('Disclaimer: This FemGuard report is generated based on a structured digital questionnaire and Ayurvedic logic scoring. It is a screening tool, not a diagnostic instrument. It is not a substitute for professional medical advice, diagnosis, or treatment.', { align: 'justify' });

    doc.end();
};

module.exports = {
    generatePDFReport
};
