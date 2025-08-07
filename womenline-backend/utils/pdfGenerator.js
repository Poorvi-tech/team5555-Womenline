const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePdf = (data, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Branding header
      doc
        .fontSize(24)
        .fillColor('#333')
        .text('WomenLine Health Report', { align: 'center' })
        .moveDown(1);

      // Date
      doc
        .fontSize(12)
        .fillColor('gray')
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
        .moveDown();

      // User Information
      doc
        .fontSize(14)
        .fillColor('#000')
        .text(`Name: ${data.user?.name || 'N/A'}`)
        .text(`Email: ${data.user?.email || 'N/A'}`)
        .text(`Period Status: ${data.periodStatus || 'N/A'}`)
        .moveDown();

      // Mood Summary
      doc
        .fontSize(14)
        .fillColor('#000')
        .text('Mood Summary:', { underline: true });

      const moodSummary = data.moodSummary || {};
      if (Object.keys(moodSummary).length === 0) {
        doc.text('No mood data available').moveDown();
      } else {
        Object.entries(moodSummary).forEach(([mood, count]) => {
          doc.text(`${mood}: ${count}`);
        });
        doc.moveDown();
      }

      // Journal Summary
      doc
        .fontSize(16)
        .fillColor('#444')
        .text('Journal Summary', { underline: true })
        .moveDown(0.5);

      const journalEntries = data.journalSummary || [];
      if (journalEntries.length === 0) {
        doc.fontSize(12).text('No journal entries found.');
      } else {
        journalEntries.forEach((entry, index) => {
          doc
            .fontSize(12)
            .fillColor('#000')
            .text(`${index + 1}. Date: ${entry.date}`)
            .text(`   Mood: ${entry.mood}`)
            .text(`   Note: ${entry.note}`)
            .moveDown(0.5);
        });
      }

      // Placeholder for Mood Graph
      doc
        .fontSize(14)
        .fillColor('gray')
        .text('Mood Graph Placeholder (to be added in Week 4)', {
          align: 'center',
          italic: true,
        })
        .moveDown(2);

      // Footer
      doc
        .fontSize(10)
        .fillColor('gray')
        .text('© 2025 WomenLine. All rights reserved.', 50, doc.page.height - 50, {
          align: 'center',
        });

      doc.end();

      writeStream.on('finish', () => {
        resolve(outputPath);
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generatePdf;
