# 🍲 FoodBridge — Surplus Food Redistribution Platform

FoodBridge is a full-stack MERN web application that connects surplus food donors (restaurants, individuals, event organizers) with NGOs and verified receivers, reducing food waste and helping feed people in need. The platform uses **AI (Google Gemini API)** to automatically estimate meal counts, generate food safety tips, and classify donation urgency in real time.

## 🚀 Live Demo
*(Add your deployed link here once live)*

## 📸 Screenshots
*(Add screenshots here once you have them)*

## ✨ Key Features

- **Role-based authentication** — separate flows for Donors, Receivers (NGOs/volunteers), and Admins using JWT and hashed passwords
- **NGO verification system** — receivers must be approved by an admin before they can claim donations, preventing platform misuse
- **AI-powered meal estimation** — Gemini API estimates how many people a donation can feed based on food type and quantity
- **AI-powered food safety tips** — automatically generated storage/handling guidance for each donation
- **AI-powered urgency classification** — donations are automatically tagged Urgent / Moderate / Low based on food type and time remaining before expiry, with a plain-language reason
- **Request-based claiming system** — instead of first-come-first-served, receivers submit requests and donors choose who to approve, giving donors control over who receives their food
- **Race-condition-safe claiming** — uses atomic MongoDB updates to prevent double-claiming
- **Admin dashboard** — admins can view and approve pending receiver accounts
- **Responsive, styled UI** — built with Tailwind CSS

## 🛠️ Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose)
**Auth:** JWT, bcrypt
**AI:** Google Gemini API
**Version Control:** Git & GitHub

## 📁 Project Structure

## ⚙️ Local Setup

### Backend
```bash
cd backend
npm install
# create a .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# GEMINI_API_KEY=your_gemini_api_key
npx nodemon server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

## 🧠 How the AI Features Work

When a donor posts a donation, the backend sends the food type and quantity to Gemini to estimate meals served and generate a safety tip. Separately, the food type and hours remaining before expiry are sent to Gemini with defined business rules, and it returns an urgency classification with a short explanation — helping receivers prioritize pickups efficiently.

## 🔒 Why Request-Based Claiming?

Rather than a simple "first click wins" system, FoodBridge lets receivers submit a request for a donation, and the donor reviews and approves one. This gives donors control over who receives their food (e.g., prioritizing based on trust or proximity) while still keeping the platform simple and fast to use.

## 📌 Future Improvements

- Geolocation-based donation matching (map view, distance filtering)
- Image upload for donations
- Real-time notifications (Socket.io)
- Impact analytics dashboard (total meals donated, top contributors)

---

Built by Adarsh Kashyap

