require('dotenv').config();
const mongoose = require('mongoose');
const { AbuseReport, ForumPost, PdfExport } = require('./models');

async function runTests() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear old test data
    console.log('Clearing previous test data...');
    await Promise.all([
      AbuseReport.deleteMany({}),
      ForumPost.deleteMany({}),
      PdfExport.deleteMany({})
    ]);
    console.log('✓ Old data cleared');

    // Insert test data
    console.log('Inserting test records...');
    const testAbuseReport = await AbuseReport.create({
      type: "spam",
      description: "Automated test report",
      location: "test-location"
    });
    
    const testForumPost = await ForumPost.create({
      content: "Test forum post content",
      tags: ["test", "debug"],
      userId: new mongoose.Types.ObjectId()
    });

    const testPdfExport = await PdfExport.create({
      userId: new mongoose.Types.ObjectId(),
      exportType: "test_export"
    });

    console.log(`
✅ Test Data Inserted Successfully:
- Abuse Reports: 1
- Forum Posts: 1
- PDF Exports: 1
`);

    // View inserted data
    console.log('Sample Abuse Report:', {
      id: testAbuseReport._id,
      type: testAbuseReport.type
    });

  } catch (err) {
    console.error('❌ TEST FAILED:', err);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

runTests();