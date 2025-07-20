const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateSamplePDF(data, outputPath) {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text('WomenLine Report', { align: 'center' });
  doc.moveDown();

  doc.fontSize(14).text(`User: ${data.user}`, { underline: true });
  doc.moveDown();

  data.entries.forEach((entry, i) => {
    doc.text(`${i + 1}. Mood: ${entry.mood}`);
    doc.text(`Note: ${entry.note}`);
    doc.text(`Date: ${entry.date}`);
    doc.moveDown();
  });

  doc.end();
}

module.exports = generateSamplePDF;
