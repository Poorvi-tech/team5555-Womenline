# Womenline Mongoose Project

This project is designed to manage abuse reports, PDF export tracking, and forum posts using MongoDB and Mongoose. It provides a structured way to handle user-generated content and reports.

## Project Structure

```
womenline-mongoose
├── models
│   ├── AbuseReport.js
│   ├── ForumPost.js
│   └── PdfExport.js
├── test.js
├── package.json
└── README.md
```

## Files Overview

- **models/AbuseReport.js**: Defines the AbuseReport schema with fields for userId, type, description, location, and timestamp. It includes an index for querying abuse reports by type.

- **models/PdfExport.js**: Defines the PdfExport schema with fields for userId, exportType, and exportedAt.

- **models/ForumPost.js**: Defines the ForumPost schema with fields for userId, content, tags, createdAt, and replies (an array of reply objects). It includes an index for querying forum posts by tags.

- **test.js**: Connects to the MongoDB database and creates dummy entries for the AbuseReport, PdfExport, and ForumPost models.

- **package.json**: Configuration file for npm, listing dependencies (Mongoose) and scripts for the project.

## Setup Instructions

1. Ensure Node.js and MongoDB are installed.
2. Create a new directory named "womenline-mongoose" and navigate into it.
3. Run `npm init -y` to create a package.json file.
4. Install Mongoose with `npm install mongoose`.
5. Create a "models" directory and add the three schema files (AbuseReport.js, PdfExport.js, ForumPost.js).
6. Create the test.js file in the root directory.
7. Run `node test.js` to execute the test and create dummy entries.

## Usage

After setting up the project and running the test script, you can check your MongoDB database for the created entries. This project can be expanded with additional features such as user authentication, more detailed reporting, and enhanced forum functionalities.