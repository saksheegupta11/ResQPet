# 🐾 ResQPet - Animal Rescue Platform

A MERN Stack-based web application to report, manage, and rescue injured or stray animals in collaboration with local NGOs.

## 🚀 Features
- **Rescue Reporting**: Report injured animals with location, images, and description.
- **NGO Dashboard**: Manage rescue requests, mark cases as accepted, and track completion.
- **Real-time Stats**: Track total rescues, pending alerts, and active cases.
- **Premium UI**: Modern glassmorphism design with dark/light mode support.
- **Secure Authentication**: Protected routes and email-based NGO registration.

## 🛠️ Tech Stack
- **Frontend:** React.js, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Email:** NodeMailer
- **State Management:** React Context API

## 📦 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saksheegupta11/ResQPet.git
   cd ResQPet
   ```

2. **Backend Setup:**
   ```bash
   cd API
   npm install
   # Create a .env file based on .env.example and add your MongoDB URI & Mailer credentials
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd UI
   npm install
   npm start
   ```


