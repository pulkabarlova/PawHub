# 🐾 PawHub

PawHub is a full-stack, responsive web application designed to connect pet owners, pet lovers, animal shelters, and veterinarians. This project was built to exceed the requirements of a modern web development course, providing a feature-rich, interactive experience utilizing a robust stack.

## ✨ Features

- **Responsive Design**: Built mobile-first utilizing Tailwind CSS. The app provides specialized layouts for mobile, tablet, and desktop devices.
- **Semantic HTML**: The frontend strictly leverages modern semantic HTML5 (`<header>`, `<main>`, `<article>`, `<aside>`, `<section>`, `<nav>`) for improved accessibility and structure.
- **Real-Time Notifications (WebSockets)**: Features server-to-client real-time alerts. When a shelter adds a new adoptable pet, a live toast notification instantly alerts all connected frontend users!
- **Zero-Config Database**: The backend is configured to automatically launch an **In-Memory MongoDB instance** and populate it with sample data if a local MongoDB server isn't found. Simply start the app and it works!
- **Extensive REST API**: Provides 25 API endpoints mapping standard CRUD operations across 5 distinct Mongoose database models.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: Vue 3 (Composition API)
*   **Build Tool**: Vite
*   **Routing**: Vue Router 4
*   **Styling**: Tailwind CSS v4
*   **Real-time**: Socket.IO-Client

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB via Mongoose
*   **In-Memory Fallback**: `mongodb-memory-server`
*   **Real-time**: Socket.IO

---

## 🚀 Getting Started

Running PawHub locally is designed to be completely frictionless. You do **not** need to install or configure MongoDB locally; the app will automatically spin up an in-memory database and populate it with sample data!

### The Easy Way (One-Click Start)

We have provided a unified shell script that will install all dependencies, start the backend database, and launch the frontend automatically.

1.  Open your terminal in the root of the `PawHub` project.
2.  Make the script executable (only needed once):
    ```bash
    chmod +x start.sh
    ```
3.  Run the application:
    ```bash
    ./start.sh
    ```

That's it! The terminal will let you know when the servers are ready.
*   **Frontend**: `http://localhost:5173`
*   **Backend API**: `http://localhost:5000`

*(To stop the application, simply press `Ctrl + C` in the terminal).*

---

### The Manual Way

If you prefer to run the services in separate terminal windows to monitor logs:

**1. Start the Backend API**
```bash
cd backend
npm install
npm start
```

**2. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 🏗️ Project Structure

The repository is organized into a mono-repo structure:

```
PawHub/
│
├── frontend/                 # Vue 3 / Vite Application
│   ├── src/
│   │   ├── router/           # Vue Router configuration
│   │   ├── views/            # Page components (Home, Adopt, Profile, etc.)
│   │   ├── App.vue           # Root layout and WebSocket listener
│   │   └── main.js           # Vue instantiation
│   └── package.json
│
└── backend/                  # Node.js / Express API
    ├── models/               # Mongoose schemas (User, Pet, Event, Post, Product)
    ├── routes/               # Express REST routers
    ├── server.js             # Main server entrypoint
    ├── seedData.js           # Database population script
    └── package.json
```

---

## 🌐 API Endpoints Overview

The backend fulfills comprehensive CRUD requirements with the following endpoints across various HTTP methods (GET, POST, PUT, DELETE):

*   **Pets**: `/api/pets` (e.g., `GET /api/pets/:id`, `POST /api/pets`)
*   **Users**: `/api/users`
*   **Posts**: `/api/posts`
*   **Events**: `/api/events`
*   **Products**: `/api/products`

*When executing a `POST` request to `/api/pets` with `"status": "adoptable"`, the WebSocket server automatically emits a `new_adoption_alert` to all clients.*

---

## 📝 Grading Criteria Checklist Fulfillment

✅ **Frontend Tech**: Vue 3 with Vite.
✅ **Navigation**: 7 completely different routes implemented (Home, Adopt, Community, Market, Events, Profile, Pet Profile).
✅ **Semantic HTML**: Pages heavily utilize semantic tags throughout the templates.
✅ **CSS**: Unified usage of Tailwind CSS.
✅ **Responsiveness**: CSS flexbox/grid and media queries (Tailwind breakpoints) provide custom layouts for mobile/desktop.
✅ **Backend Tech**: Node.js & Express.
✅ **API Endpoints**: 25 endpoints utilizing GET, POST, PUT, and DELETE methods.
✅ **Database**: MongoDB (with zero-setup fallback).
✅ **WebSockets**: Implemented via Socket.IO for cross-device alerts.
✅ **Data Models**: 5 distinct collections (Users, Pets, Posts, Events, Products).
✅ **Operations**: Full CRUD implementations across all models.