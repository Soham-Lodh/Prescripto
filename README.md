# Prescripto

<div align="center">

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

**Production-Grade Healthcare Appointment Management System**

[Live Application](https://prescripto-o5lf.vercel.app/) · [Admin & Doctor Portal](https://prescripto-admin-lyart.vercel.app/doctor-list)

</div>

---

## Executive Summary

Prescripto is a **full-stack, production-deployed healthcare platform** engineered with enterprise-grade architecture principles. The system orchestrates complete appointment lifecycle management across three independent, role-based portals — patient frontend, integrated admin/doctor interface, and REST backend — all connected through MongoDB Atlas and secured with JWT-based role-specific authentication middleware.

Built with the **MERN stack** and deployed across **Vercel**, the platform demonstrates proficiency in:
- Multi-tier application architecture and deployment strategy
- Role-based access control (RBAC) with middleware authentication
- Real-time slot management and state synchronization
- Secure file handling with Cloudinary cloud storage integration
- Input validation, password hashing, and secure credential management
- Scalable RESTful API design with normalized data models

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Core Features](#core-features)
- [Technical Stack](#technical-stack)
- [API Specification](#api-specification)
- [Data Models](#data-models)
- [Security Implementation](#security-implementation)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Deployment Guide](#deployment-guide)

---

## System Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Prescripto Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐        ┌──────────────────┐           │
│  │  Patient Portal  │        │  Admin / Doctor  │           │
│  │   (Frontend)     │        │  Portal (Admin)  │           │
│  │   React + Vite   │        │   React + Vite   │           │
│  │   Vercel ↔       │        │   Vercel ↔       │           │
│  └────────┬─────────┘        └────────┬─────────┘           │
│           │                           │                     │
│           └───────────────┬───────────┘                     │
│                           │ REST API / JWT Auth             │
│                      ┌────▼──────────┐                      │
│                      │  Express API  │                      │
│                      │  (Backend)    │                      │
│                      │  Render ↔     │                      │
│                      └───┬───────────┘                      │
│                          │                                  │
│      ┌───────────────────┼───────────────────┐              │
│      │                   │                   │              │
│  ┌───▼────────┐   ┌──────▼──────┐   ┌────────▼──┐           │
│  │  MongoDB   │   │ Cloudinary  │   │ Auth      │           │
│  │  Atlas     │   │ (Images)    │   │ (JWT)     │           │
│  └────────────┘   └─────────────┘   └───────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```


## Core Features

### Patient Portal

**Authentication & Profile Management**
- User registration with enforced password strength requirements (uppercase, lowercase, numeric, special character validation)
- JWT-based persistent session management
- Comprehensive profile management: name, phone, address, date of birth, gender
- Profile photo upload with Cloudinary cloud storage
- Real-time profile modification with optimistic state updates

**Doctor Discovery & Selection**
- Browse physician database segmented across **10 medical specialities**:
  - General Physician, Gynecologist, Dermatologist, Pediatrician, Neurologist
  - Gastroenterologist, Cardiologist, Pulmonologist, Urologist, Orthopedist
- Advanced filtering by speciality with live availability status
- Detailed doctor profiles: credentials, years of experience, consultation fees, biographical information
- Related doctor recommendations based on selected speciality

**Appointment Management**
- Interactive slot selection interface with date/time navigation
- Real-time availability status (prevents booking of already-reserved slots)
- Appointment status tracking: active, cancelled, completed, paid
- Full appointment history with filtering capabilities
- Non-destructive cancellation: automated slot restoration to physician availability pool
- Payment confirmation workflow with authorization validation
- Appointment modification restrictions post-booking

**User Engagement**
- Contact form with backend persistence and admin notification
- Appointment confirmation notifications
- Toast-based feedback system for all user actions

### Doctor Portal

**Session & Authentication**
- Secure credential-based login with bcrypt password verification
- Role-specific JWT token issuance with doctor identification

**Schedule Management**
- Consolidated view of assigned appointments with patient contact information
- Appointment status management: mark as completed, cancel with automatic slot restoration
- Availability toggle: enable/disable accepting new bookings
- Real-time schedule synchronization across all sessions

###  Admin Portal

**Physician Management**
- Add new doctors with comprehensive profile data capture
- Password strength validation with multi-criteria enforcement:
  - Minimum length requirements
  - Special character mandates
  - Prevention of name/email substring inclusion
- Doctor availability status management
- Complete doctor credential management: degree, experience level, speciality, fees
- Profile modification capabilities with real-time propagation

**Platform Oversight**
- **Dashboard Analytics**: Real-time metrics for total physicians, users, appointments, recent bookings
- **Unified Appointment Management**: View and cancel any appointment across the platform
- **Communication Management**: Contact form message inbox with sorting (latest/oldest) and read/unread state tracking

**System Controls**
- Doctor onboarding and offboarding workflows
- Availability status toggling for operational capacity management
- Message categorization and priority tracking

---

## Technical Stack

### Frontend Layer

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI framework & component architecture | 19 |
| **React Router** | Client-side routing with SPA navigation | v7 |
| **Tailwind CSS** | Utility-first CSS framework for responsive design | Latest |
| **Axios** | HTTP client with interceptor middleware | Latest |
| **React Toastify** | Non-blocking notification system | Latest |
| **Vite** | Modern ES module bundler & dev server | Latest |
| **Rolldown** | Production-grade module bundler | Latest |

### Backend Layer

| Technology | Purpose | Implementation Details |
|-----------|---------|------------------------|
| **Node.js** | JavaScript runtime for server-side execution | Latest LTS |
| **Express.js** | Minimalist web framework for HTTP routing | v4+ |
| **MongoDB Atlas** | Cloud-hosted NoSQL database | Primary data store |
| **Mongoose** | MongoDB object modeling with schema validation | v7+ |
| **JWT (jsonwebtoken)** | Stateless authentication tokens | Role-based claims |
| **bcryptjs** | Password hashing with salting | 10 salt rounds |
| **Multer** | Multipart form data handling for file uploads | Memory stream mode |
| **Cloudinary** | Cloud-based image storage & CDN | Direct upload API |
| **validator.js** | Input validation & sanitization | Email, password, string utilities |

### Infrastructure & Deployment

| Service | Purpose | Configuration |
|---------|---------|---|
| **Vercel** | Frontend hosting with auto-deployment | Zero-config Vite support |
| **MongoDB Atlas** | Managed database as a service | Cloud-hosted cluster |
| **Cloudinary** | Image storage with CDN | API-key authenticated uploads |

---

## API Specification

### Authentication Routes — `POST /api/user`

| Endpoint | Method | Authentication | Description |
|----------|--------|---|---|
| `/register` | POST | Public | Patient account creation with validation |
| `/login` | POST | Public | JWT token issuance with credential verification |

### Patient Routes — `GET/POST /api/user`

| Endpoint | Method | Auth | Description |
|----------|--------|---|---|
| `/get-profile` | GET | Bearer JWT | Retrieve authenticated user profile data |
| `/update-profile` | PUT | Bearer JWT | Modify profile information & upload avatar |
| `/book-appointment` | POST | Bearer JWT | Reserve appointment slot with conflict detection |
| `/appointments` | GET | Bearer JWT | List all user appointments with status filtering |
| `/cancel-appointment` | POST | Bearer JWT | Cancel appointment & restore availability |
| `/payment` | POST | Bearer JWT | Confirm payment status for completed appointments |

### Doctor Routes — `GET/POST /api/doctor`

| Endpoint | Method | Auth | Description |
|----------|--------|---|---|
| `/doctor-login` | POST | Public | Doctor credential verification & JWT issuance |
| `/doctor-appointments` | GET | Bearer JWT (Doctor) | Retrieve doctor's appointment schedule |
| `/complete-appointment` | POST | Bearer JWT (Doctor) | Mark appointment as completed |
| `/cancel-appointment` | POST | Bearer JWT (Doctor) | Cancel appointment with slot restoration |
| `/toggle-availability` | POST | Bearer JWT (Doctor) | Enable/disable new bookings |
| `/doctor-profile` | GET | Bearer JWT (Doctor) | Retrieve doctor profile information |

### Admin Routes — `GET/POST /api/admin`

| Endpoint | Method | Auth | Description |
|----------|--------|---|---|
| `/admin-login` | POST | Public | Admin authentication with JWT issuance |
| `/add-doctor` | POST | Bearer JWT (Admin) | Onboard new physician with profile validation |
| `/all-doctors` | GET | Bearer JWT (Admin) | Retrieve complete physician roster |
| `/change-availability` | POST | Bearer JWT (Admin) | Toggle doctor availability status |
| `/all-appointments` | GET | Bearer JWT (Admin) | Platform-wide appointment overview |
| `/cancel-appointment` | POST | Bearer JWT (Admin) | Administrative appointment cancellation |
| `/admin-dashboard` | GET | Bearer JWT (Admin) | Retrieve platform metrics & KPIs |
| `/all-messages` | GET | Bearer JWT (Admin) | Access contact form submissions |

### Contact Routes — `POST /api/contact`

| Endpoint | Method | Auth | Description |
|----------|--------|---|---|
| `/add-contact` | POST | Public | Submit contact form with persistence |

---

## Data Models

### User Model (Patients)

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, validated),
  password: String (bcrypt-hashed),
  phone: String,
  address: String,
  gender: Enum['male', 'female', 'other'],
  dob: Date,
  image: String (Cloudinary URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (bcrypt-hashed),
  image: String (Cloudinary URL),
  speciality: Enum[10 specialities],
  degree: String,
  experience: String,
  about: String,
  fees: Number,
  available: Boolean (default: true),
  slots_booked: {
    [date]: [time slots]
  },
  createdAt: Date
}
```

### Appointment Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  doctorId: ObjectId (ref: Doctor),
  slotDate: Date,
  slotTime: String,
  userData: Object (user info snapshot),
  docData: Object (doctor info snapshot),
  status: Enum['pending', 'completed', 'cancelled'],
  amount: Number,
  isPaymentDone: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Model

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (validated),
  message: String,
  isRead: Boolean (default: false),
  createdAt: Date
}
```

---

## Security Implementation

### Authentication & Authorization

**JWT-Based Access Control**
- Role-specific middleware validates token claims before route access
- Three distinct authentication tiers: `authUser`, `authAdmin`, `authDoctor`
- Token payload encodes user identity and role information
- Stateless architecture eliminates server-side session storage

**Password Security**
- Bcryptjs hashing with **10 salt rounds** applied to all user & doctor passwords
- Enforced password strength validation:
  - Minimum character requirements
  - Mixed-case + numeric + special character mandates
  - Substring matching prevention (name, email exclusion)
- Pre-save middleware ensures password compliance before persistence

### Input Validation & Sanitization

- **Email Validation**: RFC-compliant email format verification via `validator.isEmail()`
- **Password Validation**: Multi-criteria strength assessment with `validator.isStrongPassword()`
- **String Sanitization**: XSS prevention through `validator.escape()` and `validator.trim()`
- **Type Coercion**: Mongoose schema-level type enforcement

### File Upload Security

- **Memory-Stream Processing**: Multer streams files directly to Cloudinary (no disk storage)
- **Cloudinary API Authentication**: Secure cloud-based image storage with CDN delivery
- **MIME Type Validation**: Implicit validation through Cloudinary acceptance policies
- **User-Scoped Uploads**: Profile images linked to user authentication context

### API Security

- **CORS Configuration**: Controlled cross-origin access from approved frontend domains
- **Rate Limiting**: Consideration for implementation at production scale
- **HTTP Status Codes**: Proper error response semantics (401 auth, 403 forbidden, 404 not found)
- **Request Validation**: Mongoose schema validation on all database operations

---

## Project Structure

```
prescripto/
├── frontend/                          # Patient-facing application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page with hero & CTA
│   │   │   ├── Doctors.jsx           # Physician directory with filtering
│   │   │   ├── Appointments.jsx      # Slot selection interface
│   │   │   ├── MyAppointments.jsx    # Appointment history & management
│   │   │   ├── MyProfile.jsx         # Profile edit & upload
│   │   │   ├── About.jsx             # Platform information
│   │   │   ├── Contact.jsx           # Contact form submission
│   │   │   ├── Login.jsx             # Authentication gateway
│   │   │   └── NotFound.jsx          # 404 error page
│   │   ├── components/
│   │   │   ├── Header.jsx            # Navigation header
│   │   │   ├── NavBar.jsx            # Responsive navbar
│   │   │   ├── Footer.jsx            # Application footer
│   │   │   ├── SpecialityMenu.jsx    # Speciality filtering
│   │   │   ├── TopDoctors.jsx        # Featured physicians
│   │   │   ├── RelatedDoctors.jsx    # Contextual recommendations
│   │   │   ├── Banner.jsx            # Promotional sections
│   │   │   ├── Testimonials.jsx      # User testimonials
│   │   │   ├── FlipCard.jsx          # Interactive card component
│   │   │   ├── ScrollToTop.jsx       # Scroll behavior handler
│   │   │   ├── AnalyticsTracker.jsx  # User engagement tracking
│   │   │   ├── PremiumConfirmModal.jsx # Confirmation dialogs
│   │   │   └── FuzzyText.jsx         # Animated text effects
│   │   ├── context/
│   │   │   └── AppContext.jsx        # Global state management
│   │   ├── utils/
│   │   │   └── requestCache.js       # Multi-layer caching strategy
│   │   └── assets/
│   │       └── assets_frontend/      # Static images & icons
│   ├── tailwind.config.js            # Design token configuration
│   ├── vite.config.js                # Build optimization
│   └── package.json
│
├── admin/                            # Admin & Doctor portal
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Authentication gateway
│   │   │   ├── NotFound.jsx          # 404 error page
│   │   │   └── Admin/
│   │   │       ├── AddDoctor.jsx     # Physician onboarding form
│   │   │       ├── DoctorsList.jsx   # Physician management interface
│   │   │       ├── AllAppointments.jsx # Platform appointment view
│   │   │       └── Messages.jsx      # Contact submission management
│   │   ├── pages/Doctor/
│   │   │       ├── DoctorDashboard.jsx # Schedule overview
│   │   │       ├── DoctorAppointments.jsx # Appointment actions
│   │   │       └── DoctorProfile.jsx # Doctor profile view
│   │   ├── components/
│   │   │   ├── NavBar.jsx            # Application navbar
│   │   │   ├── SideBar.jsx           # Navigation sidebar
│   │   │   ├── FuzzyText.jsx         # Animated text
│   │   │   └── PremiumConfirmModal.jsx # Confirmation dialogs
│   │   ├── context/
│   │   │   ├── AdminContext.jsx      # Admin state management
│   │   │   ├── DoctorContext.jsx     # Doctor state management
│   │   │   └── AppContext.jsx        # Shared state
│   │   └── utils/
│   │       └── requestCache.js       # Caching utilities
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── backend/                          # Express REST API
    ├── controllers/
    │   ├── userController.js         # Patient endpoint handlers
    │   ├── adminController.js        # Admin endpoint handlers
    │   └── doctorController.js       # Doctor endpoint handlers
    ├── models/
    │   ├── userModel.js              # Patient schema
    │   ├── doctorModel.js            # Physician schema
    │   ├── appointmentModel.js       # Appointment schema
    │   └── contactModel.js           # Contact form schema
    ├── middleware/
    │   ├── authUser.js               # Patient JWT verification
    │   ├── authAdmin.js              # Admin JWT verification
    │   ├── authDoctor.js             # Doctor JWT verification
    │   └── multer.js                 # File upload configuration
    ├── routes/
    │   ├── userRoute.js              # Patient endpoints
    │   ├── adminRoutes.js            # Admin endpoints
    │   └── doctorRoutes.js           # Doctor endpoints
    ├── helpers/
    │   └── appointmentHelper.js      # Business logic utilities
    ├── config/
    │   ├── mongodb.js                # Database connection
    │   └── cloudinary.js             # Image storage configuration
    ├── server.js                     # Express app initialization
    └── package.json
```

---

## Installation & Setup

### Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** v9+ or **yarn** v3+
- **MongoDB Atlas** account with connection string
- **Cloudinary** account with API credentials
- **Git** for version control

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables (see below)
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm start

# Server runs on http://localhost:5000
```

### Frontend Setup (Patient Portal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Update VITE_API_URL to backend API endpoint

# Start development server
npm run dev

# Application available at http://localhost:5173
```

### Admin Portal Setup

```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Update VITE_API_URL to backend API endpoint

# Start development server
npm run dev

# Portal available at http://localhost:5174
```

---

## Environment Configuration

### Backend Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prescripto

# JWT Configuration
JWT_SECRET=your-secure-random-secret-key-min-32-chars

# Cloudinary Configuration
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS Configuration
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

### Admin Portal Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

**Security Note**: Never commit `.env` files to version control. Use `.env.local` for local development and configure secrets in deployment platform settings.

---

## Key Technical Achievements

### 1. Multi-Tier Architecture
Independently scalable frontend, admin, and backend services communicating through a unified REST API, demonstrating separation of concerns and architectural maturity.

### 2. Role-Based Access Control (RBAC)
Three distinct authentication middlewares enforce granular permission models across patient, doctor, and admin user roles with JWT-based stateless verification.

### 3. Real-Time Slot Management
Appointment booking system prevents double-booking through atomic database operations and automatic slot restoration on cancellation, maintaining data consistency across concurrent operations.

### 4. Secure File Handling
Memory-stream file uploads bypass disk storage, uploading directly to Cloudinary CDN with proper API authentication and user-scoped access controls.

### 5. Input Validation & Sanitization
Multi-layer validation strategy combining validator.js utilities, Mongoose schema enforcement, and password strength requirements prevents common security vulnerabilities.

### 6. Modern Development Stack
Leverages React 19, Vite bundling, and Tailwind CSS for rapid development with production-grade performance optimization and responsive design.


---

## Development Workflow

### Git-Based Development

```bash
# Clone repository
git clone https://github.com/Soham-Lodh/Prescripto.git
cd Prescripto

# Create feature branch
git checkout -b feature/new-feature

# Make changes across frontend/admin/backend as needed
# Install dependencies in modified directories

# Commit and push
git add .
git commit -m "feat: add new feature with clear description"
git push origin feature/new-feature

# Create Pull Request on GitHub
```

### Running All Services Locally

```bash
# Terminal 1: Backend API
cd backend && npm install && npm start

# Terminal 2: Patient Frontend
cd frontend && npm install && npm run dev

# Terminal 3: Admin Portal
cd admin && npm install && npm run dev

# Access:
# - Patient: http://localhost:5173
# - Admin: http://localhost:5174
# - Backend: http://localhost:5000
```

---

## Performance Optimizations

### Frontend Caching Strategy

The `requestCache.js` utility implements a multi-layer caching system:
- **Memory Cache**: Fast in-session data retrieval with TTL expiration
- **localStorage Persistence**: Survives page refreshes with optional persistence flag
- **Request Deduplication**: Prevents duplicate in-flight API calls
- **Configurable TTL**: Per-request cache lifetime control (default 60 seconds)

### Image Optimization

- Cloudinary CDN delivery reduces bandwidth and improves delivery speed
- Automatic format conversion (WebP for compatible browsers)
- Responsive image sizing for mobile/tablet/desktop
- Image lazy loading in list views

---

## Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Mobile**: iOS Safari 14+, Chrome Android 90+

---

## License

This project is licensed under the MIT License.

---

## Connect & Collaborate

For inquiries, contributions, or collaboration opportunities:

- **GitHub**: [github.com/Soham-Lodh/Prescripto](https://github.com/Soham-Lodh/Prescripto)
- **Live Demo**: [prescripto-o5lf.vercel.app](https://prescripto-o5lf.vercel.app/)
- **Admin Portal**: [prescripto-admin-lyart.vercel.app](https://prescripto-admin-lyart.vercel.app/doctor-list)

---

## Acknowledgments

Built with modern web technologies and best practices in full-stack development, demonstrating production-grade architectural patterns and security implementations suitable for healthcare-adjacent applications.