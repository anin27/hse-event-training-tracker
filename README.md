# HSE Training Tracker

HSE Training Event Management System
HSE Training Tracker is a full-stack MERN application that helps organisations manage Health, Safety & Environment (HSE) training programmes, including training event scheduling, employee registrations, attendance tracking, and automated email notifications, through a single web-based platform. The system is designed around a real industrial/offshore training context (fire safety, BOSIET, offshore survival), and access is controlled through secure role-based authentication and authorisation.

Live Demo: https://hse-event-training-tracker-1.onrender.com

______

# Tech Stack

The application is built using the MERN stack (MongoDB, Express.js, React, and Node.js).

**Frontend**
* React
* Axios
* CSS (Styling)

**Backend**
* Node.js
* Express.js

**Database**
* MongoDB Atlas (Mongoose)

**Authentication**
* JSON Web Tokens (JWT)
* bcryptjs

**External Services**
* SendGrid (transactional email — registration confirmations and cancellation notices)

**Deployment**
* Frontend: Render Static Site
* Backend: Render Web Service
* Database: MongoDB Atlas

______

## User Roles

**Employee**
---
Employees can:
* Log in securely
* View the dashboard
* Register for training events
* View all training registrations and their own attendance status

**Manager**
---
Managers have all Employee permissions and can also:
* Create, edit, and delete training events
* Register employees for training on their behalf
* Update attendance status (Pending, Completed, No Show)
* Remove registrations

**Admin**
---
Admins can:
* Edit existing training events
* View all events and registrations
____

## Security Features

**Authentication & Authorization (JWT)**

Every protected route verifies the user's JSON Web Token before granting access. Role-based middleware ensures users can only access features that match their 
assigned role (Admin, Manager, Employee).

**Password Security (Bcrypt)** 

No password is ever stored as plain text — each one is hashed with bcrypt before it touches the database, so even direct database access wouldn't reveal a user's actual password.

**Role-Based Access Control**

Access to specific features is restricted based on the logged-in user's role, enforced on both the UI and the API itself — for instance, only Managers are permitted to create or remove training events, regardless of what a user might attempt directly through the interface.

**Input Validation**

Every incoming request is checked with express-validator before it reaches the database — confirming required fields aren't missing, emails are properly formatted, and status values fall within the allowed set, rather than trusting the client to send clean data.

**Rate Limiting**

Authentication routes are protected by express-rate-limit, restricting repeated login attempts to reduce the risk of brute-force attacks.

**Secure HTTP Headers**

Helmet is used to set secure HTTP response headers by default, reducing exposure to common web vulnerabilities such as clickjacking and MIME-type sniffing.

**Session Isolation**

Authentication tokens are stored in sessionStorage rather than localStorage, so each browser tab maintains an independent session — useful for testing multiple roles simultaneously and reducing the risk of session data persisting unexpectedly across tabs.

