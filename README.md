# CivicConnect – Smart Civic Complaint Management System

CivicConnect is a full-stack web application designed to help manage civic complaints, organize staff assignments, and improve the process of tracking public issues.

The application provides an administrative dashboard for managing users, staff members, and complaint details.

## ✨ Features

- **Admin Dashboard** – View and manage civic complaint information.
- **User Management** – View and manage registered users.
- **Staff Management** – Manage staff information.
- **Complaint Details** – View detailed complaint information.
- **Staff Assignment** – Assign complaints to appropriate staff members.
- **Interactive Maps** – Map functionality using Leaflet and React Leaflet.

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- JavaScript
- React Router
- Axios
- Leaflet and React Leaflet
- Lucide React icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv

### Tools
- Git
- GitHub
- npm

## 📁 Project Structure

```text
CivicConnect/
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── civicconnect/        # Backend application
│   ├── server.js
│   └── package.json
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

Adjust the structure above to match the actual files and folders in your repository.

## ⚙️ Getting Started

### Prerequisites

Install the following:

- Node.js
- npm
- MongoDB or access to a MongoDB database

### 1. Clone the repository

```bash
git clone https://github.com/SelvaSardar/CivicConnect
cd CivicConnect
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open a second terminal from the project root and run:

```bash
cd civicconnect
npm install
```

### 4. Configure environment variables

Create a `.env` file in the backend directory and configure the environment variables required by the application.

For example, these may include:

- MongoDB connection URI
- JWT secret
- Backend port

Use the exact variable names expected by your backend code. Never commit real secrets or credentials to GitHub.

### 5. Start the backend

In the backend terminal:

```bash
npm run dev
```

This runs the backend using Nodemon and `server.js`.

For a regular start without Nodemon:

```bash
npm start
```

### 6. Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## 🔐 Security

- Keep database credentials and JWT secrets in environment variables.
- Do not commit `.env` files or sensitive credentials.
- Validate and protect backend API endpoints appropriately.

## 🚀 Future Enhancements

- Citizen complaint submission and tracking
- Complaint status notifications
- Advanced search and filtering
- Analytics and reporting
- Production deployment

Update this section to reflect the features planned for future development.

## 👨‍💻 Author

**SelvaSardar**

- GitHub: https://github.com/SelvaSardar
- Project Repository: https://github.com/SelvaSardar/CivicConnect

## 📄 License

Specify the project's license here if you choose to distribute it under an open-source license.
