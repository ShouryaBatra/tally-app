# Data Tally App 📊

A collaborative data gathering application built with Next.js and Firebase. Perfect for teams of up to 20+ people to track their individual contributions to a shared goal.

## Features

- ✅ **Simple Authentication** - No email verification required
- ✅ **Real-time Updates** - See everyone's contributions instantly
- ✅ **Individual Tracking** - Track your personal count
- ✅ **Team Leaderboard** - See who's contributing the most
- ✅ **Undo Functionality** - Remove accidental entries
- ✅ **Mobile Responsive** - Works great on all devices

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** and **Firestore Database**
3. In Authentication, enable **Email/Password** sign-in method
4. Copy your Firebase config from Project Settings
5. Create a `.env.local` file in the root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## How to Use

### For New Users

1. Click "Don't have an account? Sign up"
2. Enter your name, email, and password (no verification needed)
3. Start adding data points!

### For Existing Users

1. Sign in with your email and password
2. View the total team count and your personal contribution
3. Click "+ Add One" when you gather a data point
4. Click "- Remove One" if you made a mistake
5. Check the leaderboard to see team progress

## Firebase Firestore Structure

```
/users/{userId}
├── name: string
├── email: string
├── count: number
└── createdAt: string

Real-time listeners calculate the total count automatically.
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Firebase (Authentication + Firestore)
- **Styling**: Tailwind CSS with modern gradients and animations
- **Real-time**: Firestore real-time listeners

## Security Features

- Users can only modify their own count
- All Firebase security rules should be configured
- Real-time updates without exposing sensitive data

## Deploy on Vercel

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

---

Built for collaborative data gathering projects. Perfect for research teams, event organizers, or any group tracking collective progress!
