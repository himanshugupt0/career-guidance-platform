# One-Stop Personalized Career Advisor Platform

A MERN Stack based web application that helps students explore career paths, aptitude tests, college recommendations, and personalized guidance in a single platform.

---

# 🚀 Features

- User Authentication
- OTP Verification using Brevo API
- JWT Based Login System
- Career Recommendations
- Aptitude Test Module
- College Directory
- Alerts & Notifications
- Forgot Password Functionality
- Responsive Dashboard UI
- Favorites Management

---

# 🛠 Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Brevo Email API

## Deployment
- Frontend: Netlify / Render
- Backend: Render
- Database: MongoDB Atlas

---

# 📂 Project Structure

```bash
career-guidance-platform/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── api.js
│   └── main.jsx
│
├── public/
├── package.json
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/himanshugupt0/career-guidance-platform.git
```

```bash
cd career-guidance-platform
```

---

# 📦 Install Frontend Dependencies

Open terminal in root folder:

```bash
npm install
```

---

# 📦 Install Backend Dependencies

```bash
cd backend
```

```bash
npm install
```

---

# 🔐 Environment Variables Setup

## Backend Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_verified_email
BREVO_API_KEY=your_brevo_api_key
```

---

## Frontend Environment Variables

Create a `.env` file in the root folder.

For Local Development:

```env
VITE_API_URL=http://localhost:5000
```

For Production:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

# ▶️ Running the Project

## Start Backend Server

Open terminal inside backend folder:

```bash
cd backend
```

Run server:

```bash
node server.js
```

Backend will run on:

```bash
http://localhost:5000
```

---

## Start Frontend

Open new terminal in root folder:

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 🌐 Frontend & Backend Communication

Frontend communicates with backend using:

```js
import.meta.env.VITE_API_URL
```

This helps maintain separate URLs for:
- Local Development
- Production Deployment

---

# 📧 Email OTP Service

This project uses Brevo Transactional Email API for:
- Signup OTP
- Login OTP
- Forgot Password OTP

---

# 📚 Learning Outcomes

Through this project I learned:

- MERN Stack Development
- REST API Development
- Authentication & Authorization
- OTP Verification System
- MongoDB Integration
- API Integration
- Environment Variable Management
- Deployment on Netlify & Render
- Production Debugging
- Frontend & Backend Communication

---

# 👨‍💻 Author

## Himanshu Gupta

- GitHub: https://github.com/himanshugupt0
- LinkedIn: https://www.linkedin.com/in/himanshu-gupta-913627266

---
