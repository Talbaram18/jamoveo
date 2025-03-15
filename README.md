# JaMoveo

JaMoveo is a real-time collaborative music rehearsal platform that helps bands practice together with synchronized lyrics and chords.

### Features

- **User Roles**: Admin (band leader) and Player (band member) roles
- **Song Search**: Search through the song library
- **Role-Specific Views**: Different views for vocalists and instrumentalists
- **Auto-Scroll**: Automatic scrolling through lyrics during performance

## Architecture

JaMoveo uses a full-stack architecture:

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **Data Storage**: JSON file-based database for simplicity

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd jamoveo
```

### Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Running the Application


1. Start the server:

```bash
# From the server directory
npm run dev
```

2. Start the client:

```bash
# From the client directory
npm start
```

3. The application will be available at `http://localhost:3000`

## Usage Guide

### First-time setup

1. Register an admin account (only one admin account is allowed per system, after creating the first one, you won't be able to create another)
2. Register player accounts for each band member
3. Each player should select their instrument during registration

### Starting a session (Admin)

1. Log in as admin
2. Click "Start New Session"
3. Search for a song
4. Select a song to add to the session
5. Click "Go to Live Session"

### Joining a session (Players)

1. Log in with player credentials
2. Click "Go to Live Session"
3. Wait for the admin to start a session

### During a session

- The selected song's lyrics and chords will appear for all users
- Vocalists will see lyrics without chords
- Instrumentalists will see lyrics with chords
- Use the auto-scroll feature for hands-free navigation


Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
