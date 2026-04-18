<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />

# 🏥 Prescripto

### A full-stack medical appointment booking platform with role-based access, secure authentication, and real-time slot management — built and deployed from scratch.

**[🌐 Live App](https://prescripto-o5lf.vercel.app/) · [⚙️ Admin Panel](https://prescripto-admin-lyart.vercel.app/) · [📁 GitHub](https://github.com/Soham-Lodh/Prescripto)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [Security Implementation](#-security-implementation)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)

---

## 🔍 Overview

Prescripto is a **production-deployed, three-panel healthcare web application** built with the MERN stack. It handles the complete appointment lifecycle — from patient registration and doctor discovery to booking, cancellation, and payment confirmation — with dedicated portals for patients, doctors, and admins.

The project was built with a focus on **real backend architecture**: normalized Mongoose schemas, JWT-protected routes with role-specific middleware, input sanitization using `validator.js`, bcrypt password hashing with salting, Cloudinary image storage via Multer memory streams, and clean RESTful API design.

---

## 🏗️ Architecture

```
prescripto/
├── frontend/          # Patient-facing React app     → Vercel
├── admin/             # Admin + Doctor React app      → Vercel
└── backend/           # Express REST API              → Render
```

The system runs as **three independently deployed applications** sharing one backend API and one MongoDB database. The frontend and admin panels communicate with the backend via REST APIs, with all protected routes gated by role-specific JWT middleware.

```
[ Patient Frontend ] ──────┐
                            ├──► [ Express API ] ──► [ MongoDB Atlas ]
[ Admin/Doctor Panel ] ────┘         │
                                      └──► [ Cloudinary ]
```

---

## ✨ Features

### 👤 Patient Panel
- Register and log in with strong password enforcement (uppercase, lowercase, number, special character required)
- Browse doctors filtered by **10 specialities** (General Physician, Gynecologist, Dermatologist, Pediatrician, Neurologist, Gastroenterologist, and more)
- View full doctor profiles: speciality, degree, experience, consultation fee, availability status, and about section
- Book appointments by selecting available date/time slots — booked slots are locked in real time
- View upcoming and past appointments with status (active / cancelled / completed / paid)
- Cancel appointments — slots are freed back to the doctor's availability pool automatically
- Mark appointments as paid (payment toggle with authorization check)
- Edit profile information: name, phone, address, DOB, gender
- Upload and update profile photo (stored on Cloudinary)
- Contact form with backend persistence and admin visibility

### 🩺 Doctor Panel
- Secure login with bcrypt-verified credentials
- View personal appointment schedule with patient details
- Mark appointments as completed
- Cancel appointments (slot freed automatically)
- Toggle availability status on/off

### 🔧 Admin Panel
- Secure login with JWT-signed admin token
- Add new doctors with full profile data and photo upload (Cloudinary via Multer)
- Password strength validation: minimum length, special character, no name/email substrings
- View and manage all doctors — toggle availability, view profiles
- View all appointments across the platform — cancel any appointment
- Dashboard with live counts: total doctors, total patients, total appointments, latest 5 bookings
- View and manage all contact form messages with sort (latest/oldest) and read/unread state

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Tailwind CSS, Axios, React Toastify |
| Admin Panel | React 19, React Router v7, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose ODM |
| Authentication | JSON Web Tokens (JWT), bcrypt (salt rounds: 10) |
| File Uploads | Multer (memory storage) → Cloudinary |
| Input Validation | validator.js (isEmail, isStrongPassword, escape, trim) |
| Build Tool | Vite + Rolldown |
| Deployment | Vercel (frontend + admin), Render (backend) |

---

## 📡 API Reference

### Auth Routes — `/api/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new patient |
| POST | `/login` | Public | Login and receive JWT |
| GET | `/get-profile` | `Bearer JWT` | Fetch user profile |
| PUT | `/update-profile` | `Bearer JWT` | Update profile + photo |
| POST | `/book-appointment` | `Bearer JWT` | Book appointment slot |
| GET | `/appointments` | `Bearer JWT` | List user appointments |
| POST | `/cancel-appointment` | `Bearer JWT` | Cancel + free slot |
| POST | `/payment` | `Bearer JWT` | Confirm payment |
| POST | `/contact` | Public | Submit contact message |

### Doctor Routes — `/api/doctor`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/login` | Public | Doctor login |
| GET | `/appointments` | `dToken` | View appointments |
| POST | `/complete-appointment` | `dToken` | Mark completed |
| POST | `/cancel-appointment` | `dToken` | Cancel + free slot |
| GET | `/list` | Public | List all doctors |
| POST | `/change-availability` | `dToken` | Toggle availability |

### Admin Routes — `/api/admin`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/login` | Public | Admin login |
| POST | `/add-doctor` | `aToken` | Add doctor + photo |
| GET | `/all-doctors` | `aToken` | List all doctors |
| POST | `/change-availability` | `aToken` | Toggle availability |
| GET | `/appointments` | `aToken` | All appointments |
| POST | `/cancel-appointment` | `aToken` | Cancel appointment |
| GET | `/dashboard` | `aToken` | Dashboard stats |
| GET | `/messages` | `aToken` | Contact messages |

---

## 🗄 Data Models

### User
```js
{
  name:    String (sanitized),
  email:   String (unique, validated),
  password: String (bcrypt hashed, salt 10),
  image:   String (Cloudinary URL),
  address: { line1: String, line2: String },
  gender:  String,
  dob:     String,
  phone:   String
}
```

### Doctor
```js
{
  name:         String,
  email:        String (unique),
  password:     String (bcrypt hashed),
  image:        String (Cloudinary URL),
  speciality:   String (indexed),
  degree:       String,
  experience:   String,
  about:        String,
  available:    Boolean (default: true),
  fees:         Number,
  address:      Object,
  date:         Number,
  slots_booked: Object (date → [times])  // sparse booking map
}
```

### Appointment
```js
{
  userId:    String (indexed),
  docId:     String (indexed),
  slotDate:  String,
  slotTime:  String,
  userData:  Object (snapshot),
  docData:   Object (snapshot),
  amount:    Number,
  date:      String,
  cancelled: Boolean (default: false),
  payment:   Boolean (default: false),
  isCompleted: Boolean (default: false)
}
```

### Contact
```js
{
  name:    String (sanitized),
  email:   String (validated),
  message: String (sanitized),
  // timestamps: true  (createdAt, updatedAt)
}
```

---

## 🔐 Security Implementation

**Password Validation (Registration)**
- Minimum 8 characters
- Must contain uppercase, lowercase, number, and special character (`validator.isStrongPassword`)
- Hashed with `bcrypt.genSalt(10)` before storage — plain text never persisted

**Password Validation (Add Doctor — Admin)**
- Custom strength checker: minimum length, special character required
- Blocks passwords containing substrings of the doctor's name or email

**Input Sanitization**
- All user-submitted strings passed through `validator.escape()` + `validator.trim()` before DB writes
- Email validation via `validator.isEmail()` on all relevant endpoints

**JWT Middleware**
- User routes: `Authorization: Bearer <token>` header, decoded to `req.user.userId`
- Doctor routes: `dtoken` header, decoded to `req.doctor.docId`
- Admin routes: `atoken` header, signed payload verified against `ADMIN_EMAIL + ADMIN_PASSWORD`

**Authorization Checks**
- Payment endpoint verifies `appointmentData.userId === req.user.userId` before marking paid
- Cancellation endpoints verify ownership before slot manipulation

---

## 📁 Project Structure

```
prescripto/
│
├── backend/
│   ├── server.js                  # Express app, CORS, routes
│   ├── config/
│   │   ├── mongodb.js             # Mongoose connection
│   │   └── cloudinary.js         # Cloudinary SDK config
│   ├── controllers/
│   │   ├── userController.js      # Patient logic (14 handlers)
│   │   ├── doctorController.js    # Doctor logic
│   │   └── adminController.js     # Admin logic + dashboard
│   ├── middleware/
│   │   ├── authUser.js            # Bearer JWT verification
│   │   ├── authAdmin.js           # Admin token verification
│   │   └── multer.js              # Memory storage for Cloudinary
│   ├── models/
│   │   ├── userModel.js
│   │   ├── doctorModel.js
│   │   ├── appointmentModel.js
│   │   └── contactModel.js
│   └── routes/
│       ├── userRoute.js
│       ├── doctorRoutes.js
│       └── adminRoutes.js
│
├── frontend/                       # Patient-facing app
│   └── src/
│       ├── pages/                 # Home, Doctors, Appointments, Profile, etc.
│       ├── components/            # NavBar, Header, TopDoctors, Banner, etc.
│       └── context/AppContext.jsx # Global state
│
└── admin/                         # Admin + Doctor panel
    └── src/
        ├── pages/
        │   ├── Admin/             # AddDoctor, AllAppointments, DoctorsList, Messages
        │   └── Doctor/            # DoctorAppointments
        ├── components/            # NavBar, SideBar
        └── context/               # AdminContext, DoctorContext, AppContext
```

---

## ⚙️ Local Setup

**Prerequisites:** Node.js v18+, MongoDB Atlas URI, Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/Soham-Lodh/Prescripto
cd Prescripto
```

### 2. Backend
```bash
cd backend
npm install
# Add your .env file (see Environment Variables below)
node server.js
# Runs on http://localhost:4000
```

### 3. Patient Frontend
```bash
cd ../frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 4. Admin Panel
```bash
cd ../admin
npm install
npm run dev
# Runs on http://localhost:5174
```

---

## 🔑 Environment Variables

Create a `.env` file in `/backend`:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

Create a `.env` file in `/frontend` and `/admin`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

---

<div align="center">

Built by [Soham Lodh](https://linkedin.com/in/soham-lodh) · MIT License

</div>
