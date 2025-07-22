# Period Tracker App

## Overview
The Period Tracker App is a web application designed to help users track their menstrual cycles, rewards, and journal entries. It utilizes MongoDB for data storage and Mongoose for object data modeling.

## Project Structure
```
period-tracker-app
├── models
│   ├── PeriodLog.js       # Defines the PeriodLog schema for tracking menstrual cycles
│   ├── Rewards.js         # Defines the Rewards schema for tracking user rewards
│   ├── Journal.js         # Defines the Journal schema for user journal entries
│   └── index.js           # Exports all models for easy access
├── src
│   └── app.js             # Main application entry point
├── package.json           # Project metadata and dependencies
└── README.md              # Documentation for the project
```

## Models
### PeriodLog
- **userId**: Reference to the User model.
- **startDate**: Date when the period starts.
- **endDate**: Date when the period ends.
- **symptoms**: Array of symptoms experienced.
- **mood**: User's mood during the period (options: Happy, Sad, Anxious, Angry, Neutral).
- **notes**: Additional notes related to the period.
- **cycleLength**: Length of the menstrual cycle in days.

### Rewards
- **userId**: Reference to the User model.
- **category**: Category of the reward (options: Health, Mental, Supplements).
- **points**: Points associated with the reward.
- **redemptionHistory**: Array of records for redeemed rewards.

### Journal
- **userId**: Reference to the User model.
- **entries**: Array of journal entries.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd period-tracker-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Connect to your MongoDB database by updating the connection string in `src/app.js`.

4. Start the application:
   ```
   node src/app.js
   ```

## Usage
- Use the API endpoints to create, read, update, and delete records for PeriodLog, Rewards, and Journal models.
- Ensure to handle user authentication and authorization as needed.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.