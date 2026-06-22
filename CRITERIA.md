# PawHub — Project Criteria & Fulfillment

This document transcribes the course grading criteria and shows exactly **where and how PawHub fulfills each one**. PawHub is a **team** project, so the stricter team-tier thresholds apply (shown in **bold** where they differ from the solo minimum).

Legend: ✅ fulfilled · 📍 where it lives.

---

## Frontend

| # | Criterion | Requirement (team tier) | Status | Where / How |
|---|-----------|-------------------------|--------|-------------|
| F1 | **Technology** | A frontend framework of choice (Vue suggested) | ✅ | Vue 3 + Vite + Vue Router + Tailwind CSS v4. `frontend/package.json`, `frontend/vite.config.js` |
| F2 | **Navigation** | At least **5** different pages / routes | ✅ | **11 routes** in `frontend/src/router/routes.js`: `/`, `/adopt`, `/events`, `/shop`, `/cart`, `/community`, `/post/:id`, `/profile`, `/pet/:id`, `/login`, `/register` |
| F3 | **Semantic HTML** | At least **5** different semantic elements | ✅ | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` used across `App.vue`, `components/layout/*`, and the views |
| F4 | **CSS** | A CSS framework used consistently | ✅ | Tailwind CSS v4 utility classes throughout every component; `frontend/src/style.css` |
| F5 | **Responsiveness** | Different layout on mobile vs desktop | ✅ | Tailwind breakpoints (`sm:`/`md:`/`lg:`/`xl:`) in every view; mobile hamburger menu in `components/layout/AppHeader.vue` |

## Backend

| # | Criterion | Requirement (team tier) | Status | Where / How |
|---|-----------|-------------------------|--------|-------------|
| B1 | **Technology** | Any backend (Express suggested) | ✅ | Node.js (ESM) + Express 5. `backend/app.js`, `backend/server.js` |
| B2 | **API Endpoints** | At least **14** endpoints, **≥3** HTTP methods | ✅ | **29 endpoints** across **4 methods** (GET/POST/PUT/DELETE). See the endpoint table below. `backend/routes/*`, `backend/controllers/*` |
| B3 | **Database Connection** | Backend connected to a database | ✅ | Mongoose → MongoDB (containerized, persistent volume). `backend/config/db.js`, `docker-compose.yml` |
| B4 | **WebSockets** | Mandatory **server → client** event | ✅ | `new_adoption_alert` emitted when an adoptable pet is created → live toast. `backend/config/socket.js` (`emitAdoptionAlert`), `backend/controllers/pet.controller.js`, `frontend/src/composables/useSocket.js`, `frontend/src/components/ui/ToastNotification.vue` |

## Database

| # | Criterion | Requirement (team tier) | Status | Where / How |
|---|-----------|-------------------------|--------|-------------|
| D1 | **Technology** | Database of choice | ✅ | MongoDB via Mongoose |
| D2 | **Data Model** | At least **5** entity types | ✅ | **6 collections**: User, Pet, Post, Event, Product, Application. `backend/models/` |
| D3 | **User Data** | Login optional; hashing optional | ✅ | JWT auth with bcrypt-hashed passwords (incl. seeded demo accounts). `backend/middleware/auth.js`, `backend/controllers/user.controller.js`, `backend/seed/users.seed.js` |
| D4 | **Hard-Coded Content** | Extra collections may be read-only seeded data | ✅ | Events & Products are seeded and browse-only in the UI. `backend/seed/events.seed.js`, `backend/seed/products.seed.js` |
| D5 | **Operations** | Create + Read + Update on ≥1 collection | ✅ | **Pets** support full C/R/U via the UI (Read `/adopt`, Create on `/profile`, Update `PUT /api/pets/:id`, owner-only). **Adoption applications** add Create/Read/Delete via the UI (apply, list on `/profile`, withdraw), idempotent per (pet, user). `controllers/pet.controller.js`, `controllers/application.controller.js`, `views/PetProfile.vue` |

---

## API endpoint inventory (29 total)

| Resource | Endpoints | Count |
|----------|-----------|-------|
| Users | `POST /api/users/register`, `POST /api/users/login`, `GET /api/users/me`, `GET /api/users`, `GET /api/users/:id`, `PUT /api/users/:id` | 6 |
| Pets | `GET /api/pets`, `GET /api/pets/:id`, `POST /api/pets`, `PUT /api/pets/:id` (auth, owner), `DELETE /api/pets/:id` (auth, owner) | 5 |
| Posts | `GET /api/posts`, `GET /api/posts/:id`, `POST /api/posts`, `PUT /api/posts/:id` (auth, author), `DELETE /api/posts/:id` (auth, author) | 5 |
| Events | `GET /api/events`, `GET /api/events/:id`, `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id` | 5 |
| Products | `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` | 5 |
| Applications | `POST /api/applications` (apply, idempotent), `GET /api/applications/me`, `DELETE /api/applications/:id` (withdraw) | 3 |

Plus a `GET /api/health` check (not counted above). HTTP methods used: **GET, POST, PUT, DELETE** (4 ≥ 3 required).

---

## How to verify

1. **Launch (one click):** `docker compose up --build` → frontend http://localhost:5173, backend http://localhost:5001.
2. **Entities (6):** `ls backend/models` → `User Pet Post Event Product Application`.
3. **Endpoints / counts:**
   - `curl localhost:5001/api/pets | jq length` → 13
   - `curl localhost:5001/api/events | jq length` → 5
   - `curl localhost:5001/api/products | jq length` → 8
4. **Auth + CRUD:** log in with a demo account (`alice@example.com` / `password123`), then add a pet on `/profile` with status **For Adoption**.
5. **WebSocket:** that add immediately raises a toast ("New pet up for adoption…") in this tab and any second open tab — the mandatory server→client event.
6. **Adoption flow:** on a pet page, **Apply to Adopt** (requires login) → button switches to "Cancel application"; re-applying never duplicates; cancel removes it; applications also appear on `/profile`.
7. **Navigation / responsiveness:** browse `/`, `/adopt`, `/events`, `/shop`, `/cart`, `/community`, `/profile`; shrink the window to see the mobile hamburger menu and stacked grids.

### Seeded demo accounts (all password `password123`)

| Email | Role |
|-------|------|
| `shelter@example.com` | shelter |
| `smith@vetclinic.com` | vet |
| `alice@example.com` | owner |
| `bob@example.com` | owner |
| `sarah@example.com` | owner |
