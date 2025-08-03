// scripts/createDummyPDF.js
const path = require('path');
const fs = require('fs');
const generateSamplePDF = require('../utils/pdfGenerator');

const outputDir = path.join(__dirname, '..', 'sample');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const outputPath = path.join(outputDir, 'health-summary.pdf');

const dummyData = {
  user: 'Test User',
  entries: [                                    
    { mood: 'Happy', note: 'Had a good day', date: '2025-07-29' },  // sample dummy data
    { mood: 'Sad', note: 'Felt low in the evening', date: '2025-07-28' },
    { mood: 'Neutral', note: 'Just a normal day', date: '2025-07-27' }
  ]
};

generateSamplePDF(dummyData, outputPath);
console.log('✅ Dummy PDF generated at sample/health-summary.pdf');
