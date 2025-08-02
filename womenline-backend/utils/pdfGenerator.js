const PDFDocument = require('pdfkit');
const fs = require('fs');

// Function to generate a sample PDF report
function generateSamplePDF(data, outputPath) {
  const doc = new PDFDocument();

  // Stream PDF content to a file
  doc.pipe(fs.createWriteStream(outputPath));

  // Report Title
  doc.fontSize(20).text('WomenLine Report', { align: 'center' });
  doc.moveDown();

   // User Details
  doc.fontSize(14).text(`User: ${data.user}`, { underline: true });
  doc.moveDown();

  // Journal Entries
  data.entries.forEach((entry, index) => {
    doc.fontSize(12).text(`${index + 1}. Mood: ${entry.mood}`);
    doc.text(`   Note: ${entry.note}`);
    doc.text(`   Date: ${entry.date}`);
    doc.moveDown(); // Space between entries
  });

  doc.end();
}

module.exports = generateSamplePDF;
