const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// Chart size
const width = 600;
const height = 300;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// Generates a PDF report
const generatePdf = async (data, outputPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

        // Header
      doc
        .fontSize(24)
        .fillColor('#333')
        .text('WomenLine Health Report', { align: 'center' })
        .moveDown(1);

      // Current date
      doc
        .fontSize(12)
        .fillColor('gray')
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
        .moveDown();

      // User info
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

      // Mood graph
      if (Object.keys(moodSummary).length > 0) {
        const config = {
          type: 'bar',
          data: {
            labels: Object.keys(moodSummary),
            datasets: [
              {
                label: 'Mood Count',
                data: Object.values(moodSummary),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
            ],
          },
          options: {
            responsive: false,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Mood Graph',
              },
            },
          },
        };

        // Render chart to buffer and save as temp image
        const buffer = await chartJSNodeCanvas.renderToBuffer(config);
        const tempImagePath = path.join(__dirname, 'temp-mood-graph.png');
        fs.writeFileSync(tempImagePath, buffer);

         // Add chart to PDF
        doc.addPage();
        doc.image(tempImagePath, {
          fit: [500, 300],
          align: 'center',
          valign: 'center',
        });

        fs.unlinkSync(tempImagePath); // Cleanup
      }

      // Footer
      doc
        .fontSize(10)
        .fillColor('gray')
        .text('© 2025 WomenLine. All rights reserved.', 50, doc.page.height - 50, {
          align: 'center',
        });

      doc.end();

       // Resolve when write stream finishes
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
