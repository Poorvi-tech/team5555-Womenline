const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateSamplePDF(data, outputPath) {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(outputPath));

  // Title
  doc.fontSize(20).text('WomenLine Report', { align: 'center' });
  doc.moveDown();

  // User Name
  doc.fontSize(14).text(`User: ${data.user}`, { underline: true });
  doc.moveDown();

  // Entries
  data.entries.forEach((entry, index) => {
    doc.fontSize(12).text(`${index + 1}. Mood: ${entry.mood}`);
    doc.text(`   Note: ${entry.note}`);
    doc.text(`   Date: ${entry.date}`);
    doc.moveDown(); // Add space between entries
  });

  doc.end();
}

module.exports = generateSamplePDF;
