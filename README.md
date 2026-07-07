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

______

## Project Structure

```
hse-tracker/
│
├── client/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── App.test.js
│   │   ├── Dashboard.js
│   │   ├── DashboardStats.js
│   │   ├── Events.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── Login.js
│   │   ├── Login.css
│   │   ├── logo.svg
│   │   ├── Registrations.js
│   │   └── setupTests.js
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── middleware/
│   │   ├── auth.js
│   │   └── role.js
│   ├── models/
│   │   ├── Enrolment.js
│   │   ├── Event.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── enrolments.js
│   │   └── events.js
│   ├── utils/
│   │   └── mailer.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
└── README.md
```
___
## How to Run This Project Locally

**Prerequisites**

* Node.js v18 or later
* A MongoDB Atlas account
* A SendGrid account with a verified sender


**Step 1: Clone the Repository**
```
git clone https://github.com/anin27/hse-event-training-tracker.git
cd hse-event-training-tracker
```

**Step 2: Configure Backend Environment Variables**

Create a `.env` file inside the server folder.
```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```
**Step 3: Install Backend Dependencies**
```
cd server
npm install
npm start
```
The backend runs on:
```
http://localhost:5000
```

**Step 4: Install Frontend Dependencies**

Open a new terminal.
```
cd client
npm install
npm start
```
The frontend runs on:
```
http://localhost:3000
```
**Step 5: Open the Application**

Visit http://localhost:3000 and register a new account to get started, selecting a role (Employee, Manager, or Admin) during sign-up.

____
## Deployment

The application is deployed using Render.

**Frontend**

The React application is hosted as a Render Static Site. The build communicates with the backend using a base URL configured directly in api.js.

**Backend**

The Express API is deployed as a Render Web Service. Environment variables are configured securely through the Render dashboard, allowing the application to connect to MongoDB Atlas and SendGrid without exposing sensitive information in the codebase.

**Database**

MongoDB Atlas is used as the cloud-hosted database. Network Access is configured to allow connections from anywhere (0.0.0.0/0), since Render's free tier does not provide a fixed outbound IP address.

___
## Challenges and Solutions

**Session Data Persisting Across Browser Tabs**

Authentication data was initially stored in localStorage, which is shared across all tabs for the same site. This meant logging into a different role in one tab would silently change the logged-in role in every other open tab. This was resolved by switching to sessionStorage, which is scoped per tab.

**Employee Dashboard Showing Zero Registrations (403 Forbidden)** 

When employees logged in, the dashboard displayed 0 total registrations and the registrations page was completely empty, while managers could see all registrations correctly. The browser console revealed `403 Forbidden` errors on the `/api/enrolments` endpoint. This was traced to the backend route having a role-based restriction that only allowed admin and manager access, blocking employees entirely. It was resolved by removing the role restriction from the GET `/enrolments` endpoint to allow all authenticated users to view registrations.

**CORS Blocking Requests After Deployment**

After deploying the frontend and backend separately, API requests were blocked with CORS errors because the backend's allowed origin list did not exactly match the deployed frontend URL. This was resolved by explicitly setting the frontend's deployed URL in the backend's CORS configuration.

**Status Field Not Saving Correctly**

Attendance status selected on the registration form was not being saved, and new registrations always defaulted to "Pending." This was traced to the backend route not reading the status field from the request body at all, and was fixed by including it in the destructured request and passing it through to the database write.

**Registrations Causing a Crash**

Deleting a training event that still had active registrations left those registrations pointing to a non-existent event, which caused the Registrations page to crash when trying to read the deleted event's title. This was resolved by implementing cascade deletion — removing an event now also removes its associated registrations and sends a cancellation email to each affected employee — along with defensive checks in the frontend for any legacy orphaned data.

___

## Limitations

* The backend runs on Render's free tier, which introduces cold-start delays (30–60 seconds) after periods of inactivity.
* Confirmation and cancellation emails are sent from a Gmail address via SendGrid, which may occasionally be filtered to spam by some email providers due to standard sender-reputation heuristics, since the sending domain is not a dedicated authenticated domain.
* Employee accounts are self-registered rather than provisioned by a manager or admin, so there is currently no central employee-onboarding workflow.

___

## Key Learnings

Developing this project strengthened my understanding of full-stack web development using the MERN stack. It provided practical experience implementing role-based authentication, integrating third-party APIs (SendGrid for transactional email), enforcing server-side business rules such as capacity limits and cascade deletion, and deploying both frontend and backend services independently on Render. Debugging issues involving browser storage scope, CORS configuration, and data validation also improved my understanding of how client-server applications behave once moved from a local development environment into production.

___

## Future Improvements

* Restrict CORS to a single, precisely maintained list of trusted origins as the project evolves.
* Add a lightweight keep-alive mechanism to reduce backend cold-start delays.
* Allow managers to bulk-import or provision employee accounts rather than relying on self-registration.
* Add a certificate-of-completion download for employees who complete training.
* Improve dashboard analytics with charts summarising attendance trends over time.

___

## Conclusion

HSE Training Tracker is a secure, role-based training management platform developed using the MERN stack. The application provides training event scheduling, employee registration, attendance tracking, capacity enforcement, and automated email notifications within a single system. Building and deploying the project provided valuable practical experience in developing, securing, and deploying a full-stack web application while solving real-world development and deployment challenges.

___

## Module Information

Module: B9IS130 – Web Development for Information Systems

Module Leader: Dr. Obinna Izima

Institution: Dublin Business School

Student: Anin Thomas (20076600)
