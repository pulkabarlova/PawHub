# 🐾 PawHub

PawHub is a full-stack, responsive web application that connects pet owners, pet lovers, animal shelters, and veterinarians. Browse adoptable pets, join community discussions, discover local events, shop for pet supplies, and manage your own profile — all in one place.

## ✨ Features

- **Pet adoption** — browse and filter adoptable dogs, cats and birds; view detailed pet profiles.
- **Community forum** — share photos and discussions; post when logged in.
- **Events** — adoption days, vaccination clinics, and fundraisers hosted by shelters and vets.
- **Shop** — browse pet products by category (food, toys, accessories, health).
- **User profiles & auth** — JWT login/register; manage your own pets.
- **Real-time notifications (WebSockets)** — when a shelter lists a new adoptable pet, every connected client instantly gets a live toast.
- **Reproducible, one-click setup** — the whole stack (MongoDB + API + frontend) runs in Docker and auto-seeds demo data on first boot.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build tool**: Vite
- **Routing**: Vue Router 4
- **State**: Pinia (`auth`, `notifications` stores)
- **Styling**: Tailwind CSS v4
- **Real-time**: Socket.IO client
- **Architecture**: a service layer (`src/services/`) wraps all HTTP; views stay thin

### Backend
- **Runtime**: Node.js (ESM)
- **Framework**: Express 5 (`app.js` builds the app, `server.js` starts it)
- **Database**: MongoDB via Mongoose
- **Structure**: `routes/` → `controllers/` → `models/`, with `config/` (db, socket), `middleware/` (auth, asyncHandler, error), and `seed/`
- **Real-time**: Socket.IO

---

## 🚀 Getting Started

### Option A — Docker (recommended, one click)

Requires Docker + Docker Compose. From the repo root:

```bash
docker compose up --build
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

MongoDB runs in a container with a persistent volume (`mongo_data`) and is **seeded automatically on first boot** when empty. Data survives restarts. To reset everything:

```bash
docker compose down -v
```

### Option B — Local dev (no Docker)

Requires Node.js. If no MongoDB is reachable, the backend falls back to an in-memory MongoDB and seeds it automatically (handy for quick local runs).

```bash
# Backend (http://localhost:5001)
cd backend && npm install && npm run dev

# Frontend (http://localhost:5173) — in a second terminal
cd frontend && npm install && npm run dev
```

Or use the helper script from the repo root: `./start.sh`.

### Demo accounts

All seeded accounts use the password **`password123`**:

| Email | Role |
|-------|------|
| `shelter@example.com` | shelter |
| `smith@vetclinic.com` | vet |
| `alice@example.com` | owner |
| `bob@example.com` | owner |
| `sarah@example.com` | owner |

---

## 🏗️ Project Structure

```
PawHub/
├── docker-compose.yml         # one-click stack: mongo + backend + frontend
├── CRITERIA.md                # course criteria mapped to where each is fulfilled
├── pictures/                  # static pet/post images served by the API
│
├── frontend/                  # Vue 3 + Vite app
│   ├── Dockerfile / nginx.conf
│   ├── .env.development / .env.production
│   └── src/
│       ├── main.js            # app bootstrap (Pinia + Router)
│       ├── App.vue            # thin shell: header / toast / <RouterView> / footer
│       ├── router/            # routes.js + guards.js + index.js
│       ├── stores/            # Pinia: auth.js, notifications.js
│       ├── services/          # http.js + per-domain API services
│       ├── composables/       # useAuth (store shim), useSocket
│       ├── components/        # layout/, ui/, pets/, events/, products/
│       ├── models/            # JSDoc typedefs
│       ├── views/             # page components
│       └── utils/             # media URL resolver
│
└── backend/                   # Node + Express API
    ├── Dockerfile
    ├── app.js / server.js
    ├── config/                # db.js (connect + seed-if-empty), socket.js
    ├── controllers/           # user, pet, post, event, product
    ├── routes/                # thin routers
    ├── middleware/            # auth, asyncHandler, error
    ├── models/                # User, Pet, Post, Event, Product
    └── seed/                  # per-entity seed data
```

---

## 🌐 API Overview

29 REST endpoints across 6 resources, using GET / POST / PUT / DELETE:

- **Users**: `/api/users` (register, login, me, list, get, update)
- **Pets**: `/api/pets` (full CRUD; update/delete are owner-only; `POST` an adoptable pet emits `new_adoption_alert`)
- **Posts**: `/api/posts` (full CRUD; update/delete are author-only; list is newest-first with author populated)
- **Events**: `/api/events` (full CRUD)
- **Products**: `/api/products` (full CRUD; supports `?category=`)
- **Applications**: `/api/applications` (adopt: `POST` apply [idempotent], `GET /me`, `DELETE /:id` withdraw)

Auth is JWT-based: login/register return a token sent as `Authorization: Bearer <token>`; protected/owned routes use the `auth` middleware. A 401 from an expired token clears the client session automatically.

See **[CRITERIA.md](./CRITERIA.md)** for the full endpoint inventory and how each grading criterion is met.

---

## 🔧 Configuration

| Variable | Where | Default | Purpose |
|----------|-------|---------|---------|
| `PORT` | backend | `5001` | API port |
| `MONGO_URI` | backend | in-memory fallback | MongoDB connection string |
| `JWT_SECRET` | backend | dev fallback | JWT signing secret |
| `VITE_API_BASE_URL` | frontend | `http://localhost:5001` | API base URL |
| `VITE_WS_URL` | frontend | = API base | Socket.IO URL |

Copy `backend/.env.example` / `frontend/.env.example` as needed. Docker supplies all of these via `docker-compose.yml`.
