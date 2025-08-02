const PDFDocument = require('pdfkit');
const fs = require('fs');

// Function to generate a branded PDF report with Mood Graph (clean version)
function generateSamplePDF(data, outputPath) {
  const doc = new PDFDocument();

  // Stream PDF content to a file
  doc.pipe(fs.createWriteStream(outputPath));

  // --- WomenLine Branding ---
  doc.fontSize(24).text('WomenLine Health Report', { align: 'center' });
  doc.fontSize(10).fillColor('gray').text('Empowering Women’s Wellness', { align: 'center' });
  doc.moveDown(2);  // Added extra spacing after branding

  // --- User Details ---
  doc.fontSize(14).fillColor('black').text(`User: ${data.user}`, { underline: true });
  doc.moveDown();

  // --- Journal Entries ---
  data.entries.forEach((entry, index) => {
    doc.fontSize(12).text(`${index + 1}. Mood: ${entry.mood}`);
    doc.text(`   Note: ${entry.note}`);
    doc.text(`   Date: ${entry.date}`);
    doc.moveDown();
  });

  // --- Mood Graph Section ---
  doc.addPage();
  doc.fontSize(18).fillColor('black').text('Mood Graph Overview', { align: 'center' });
  doc.moveDown(2);

  // Placeholder Text (no box)
  doc.fontSize(12).fillColor('gray').text(
    '(Mood graph will be generated when sufficient data is available)',
    { align: 'center' }
  );

  doc.end();
}

module.exports = generateSamplePDF;
