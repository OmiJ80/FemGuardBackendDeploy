# FemGuard: PCOS & Fertility Risk Screening Tool (PWA)

## 📌 Project Overview
FemGuard is a Progressive Web Application (PWA) designed to empower women with early risk screening and preventive self-care tools for Polycystic Ovary Syndrome (PCOS), Infertility, and Metabolic Disease. 

The application uses a comprehensive 3-module clinical algorithm, combined with Ayurvedic interpretation, to assess risk factors. It also features a premium Ovulation Tracker, comprehensive Admin analytics, and PDF report generation.

---

## 🚀 Key Features

### 1. Advanced 3-Module Risk Assessment
Unlike generic questionnaires, FemGuard uses a specific 21+ question weighted algorithm to calculate three distinct risk profiles:
*   **PCOS Risk Module:** Evaluates cycle patterns, hyperandrogenism, BMI, insulin resistance, etc. Outputs "Less Dosh Imbalance", "Kapha-Medo Dushti", or "Kapha-Vata Avarana".
*   **Metabolic Syndrome Risk Module:** Evaluates blood pressure, fasting glucose, triglycerides, Acanthosis Nigricans, etc. Outputs likelihood of "Premeha".
*   **Infertility Risk Module:** Evaluates ovulatory dysfunction, conception attempts, age, etc. Outputs "Apana Vata" and "Beeja/Kshetra" health status.

### 2. Period & Ovulation Tracker (Premium)
*   Logs last period date and average cycle length.
*   Predicts the next period date and fertile window.
*   Protected by a premium subscription gateway.

### 3. User Dashboard & PDF Reports
*   Tracks assessment history and cycle logs.
*   Visual, color-coded gauges for risk results.
*   Generates a detailed, downloadable PDF clinical report summarizing scores and providing personalized recommendations. 

### 4. Admin Dashboard
*   Monitors total registered users and premium subscribers.
*   Visualizes PCOS Risk Distribution across the platform using interactive charts.
*   Allows the export of anonymized risk reports (CSV) for data analysis.

### 5. Monetization & Security
*   Razorpay integration (simulated checkout) for unlocking Premium features.
*   JWT-based authentication with secure password hashing.

---

## 🛠️ Technology Stack

**Frontend (Client)**
*   React 18 + Vite
*   Tailwind CSS (Styling)
*   React Router (Navigation)
*   Vite PWA Plugin (Offline support, installability)
*   Chart.js / react-chartjs-2 (Admin Dashboards)
*   Axios (API requests)

**Backend (Server)**
*   Node.js + Express.js
*   MySQL 2 (Database connection pooling)
*   JSON Web Tokens (JWT) (Authentication)
*   Bcrypt.js (Password hashing)
*   PDFKit (PDF generation)
*   Cors & Dotenv

---

## 📂 Project Structure

```text
pcos-fertility-app/
│
├── backend/                       # Node/Express API Server
│   ├── config/
│   │   └── db.js                  # MySQL Connection & Auto-Initialization
│   ├── controllers/               # Business Logic Layer
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── riskController.js
│   │   └── trackerController.js
│   ├── database/
│   │   └── schema.sql             # SQL Table Definitions
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT Protection & Admin Guards
│   ├── models/                    # Database Queries Layer
│   │   ├── adminModel.js
│   │   ├── paymentModel.js
│   │   ├── riskModel.js
│   │   ├── trackerModel.js
│   │   └── userModel.js
│   ├── routes/                    # API Endpoints
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── riskRoutes.js
│   │   └── trackerRoutes.js
│   ├── utils/                     # Helpers
│   │   ├── ayurvedicLogic.js      # Core scoring algorithms for 3 modules
│   │   └── pdfGenerator.js        # PDFKit report layouts
│   ├── .env                       # Backend Secrets
│   ├── create_admin.js            # Setup script: creates admin user
│   └── server.js                  # Express App Entry Point
│
└── frontend/                      # React PWA (Vite)
    ├── public/                    # Static Assets (PWA Icons)
    ├── src/
    │   ├── api/                   
    │   │   ├── axios.js           # Axios Interceptor (Auto-attaches JWT)
    │   │   └── useRazorpay.js     # Payment Hook
    │   ├── components/            
    │   │   └── Navbar.jsx         # Navigation Bar
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global User State
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx # Analytics & CSV Export
    │   │   ├── Dashboard.jsx      # User Home & Recent Activity
    │   │   ├── Login.jsx          
    │   │   ├── Register.jsx       
    │   │   ├── OvulationTracker.jsx # Premium Feature Calendar
    │   │   └── RiskAssessment.jsx # Dynamic 21-Question Form & Results
    │   ├── App.jsx                # Routing & Layout Wrapper
    │   ├── index.css              # Tailwind Base & Custom UI Globals
    │   └── main.jsx               # React DOM Entry
    ├── index.html                 # Main HTML Template (PWA Meta tags)
    ├── tailwind.config.js         # Tailwind settings
    └── vite.config.js             # Vite & PWA Configuration
```

---

## ⚙️ Setup & Installation Instructions

### 1. Database Setup
Ensure you have **MySQL** running locally on port `3306`. (e.g., via XAMPP).
The backend is configured to **automatically create** the database (`pcos_fertility_db`) and tables upon startup. 

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd c:\Antigravity\pcos-fertility-app\backend
npm install
```

Configure environment variables in `backend/.env` if they differ from the defaults:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=pcos_fertility_db
JWT_SECRET=femguard_super_secret_key_2026
```

Start the backend server (starts on `http://localhost:5000`):
```bash
npx nodemon server.js
```

### 3. Frontend Setup
Open a **second terminal** and navigate to the frontend directory:
```bash
cd c:\Antigravity\pcos-fertility-app\frontend
npm install
```

Start the React development server:
```bash
npm run dev
```

### 4. Admin Account Initialization
To test the admin features, you can manually run the setup script to bypass registration:
```bash
cd backend
node create_admin.js
```
* **Email:** Set in `.env`
* **Password:** Set in `.env`

Navigate to `http://localhost:5173/admin` to view the controls.
