# BlinkCare - Emergency Medical Alert System

A local medical emergency application with blink detection, geolocation, and SQLite database storage.

## Quick Start

### Prerequisites
- Node.js (any recent version)
- npm (comes with Node.js)

### Installation & Setup

1. **Navigate to project directory:**
   \`\`\`bash
   cd eye
   cd ..
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the server:**
   \`\`\`bash
   npm start
   \`\`\`

The server will start at `http://localhost:3000`

### Access the Application

- **Login/Registration:** http://localhost:3000/login.html
- **Emergency Page:** http://localhost:3000/emergency.html
- **Database Management:** http://localhost:3000/database.html

## Features

- **User Authentication** - Secure login and registration
- **Medical Information Storage** - Blood group, conditions, allergies, doctor contact
- **Blink Detection** - Eyes-free emergency alert using facial landmarks
- **Geolocation Tracking** - Sends location with SOS alert
- **Local SQLite Database** - All data stored locally (users.db)
- **Database Management UI** - View and manage user records

## Database Schema

The SQLite database (`users.db`) contains:

\`\`\`
users table:
- id: Unique identifier
- username: User's username (unique)
- password: Hashed password
- blood_group: Blood type (O+, A+, B+, AB+, etc.)
- medical_condition: Current medical conditions
- contact_number: Emergency contact phone
- doctor_name: Doctor's name for emergency
- allergies: Known allergies
- created_at: Account creation timestamp
\`\`\`

## How It Works

1. **Register** - Create account with medical information
2. **Login** - Authenticate with username and password
3. **Emergency Mode** - Use blink detection or keyboard to activate SOS
4. **Send Alert** - System gets location and sends emergency data
5. **Database** - All user data stored in local SQLite database

## File Structure

\`\`\`
eye/
├── login.html          # Login/Registration page
├── emergency.html      # Emergency SOS interface
├── database.html       # Database management page
├── index.html          # Original files (unchanged)
├── game.html
├── phrases.html
../
├── server.js          # Node.js server with API routes
├── package.json       # Dependencies
├── users.db          # SQLite database (auto-created)
└── README.md
\`\`\`

## Troubleshooting

**Server won't start:**
- Make sure port 3000 is not in use
- Try: `npm install` again

**Can't connect to database:**
- Check server is running (`npm start`)
- Clear browser cache and try again

**Login shows "Connection error":**
- Verify server is running on http://localhost:3000
- Check browser console for errors (F12)

## Data Privacy

All data is stored locally on your computer in `users.db`. Nothing is sent to external servers (except geolocation data during SOS).
