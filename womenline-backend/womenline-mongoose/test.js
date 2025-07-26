const mongoose = require('mongoose');
const AbuseReport = require('./models/AbuseReport');
const PdfExport = require('./models/PdfExport');
const ForumPost = require('./models/ForumPost');

mongoose.connect('mongodb://localhost:27017/womenline', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Dummy entries for testing
async function createDummyEntries() {
    const abuseReport = new AbuseReport({
        userId: null, // Anonymous report
        type: 'Harassment',
        description: 'Inappropriate comments made in public.',
        location: 'Delhi'
    });
    await abuseReport.save();

    const pdfExport = new PdfExport({
        userId: '60d5ec49f1b2c8b1f8c8e8e8', // Example user ID
        exportType: 'Wellness Guide'
    });
    await pdfExport.save();

    const forumPost = new ForumPost({
        userId: null, // Anonymous post
        content: 'What are the best practices for mental health?',
        tags: ['mental health', 'wellness']
    });
    await forumPost.save();

    console.log('Dummy entries created');
}

createDummyEntries().then(() => mongoose.disconnect());