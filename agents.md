# PawHub Agent Guide

How to work safely and consistently in this repository.

## Project Overview

- **Type**: Full-stack monorepo (`frontend` + `backend`)
- **Domain**: Pet adoption + community platform (adopt, community forum, events, shop, profiles)
- **Frontend**: Vue 3 + Vite + Vue Router + Pinia + Tailwind CSS v4 (plain JS, `<script setup>`)
- **Backend**: Node.js (ESM) + Express 5 + Mongoose + Socket.IO
- **Database**: MongoDB. In Docker it is a real `mongo` container with a persistent volume; without `MONGO_URI` the backend falls back to an in-memory MongoDB for local dev. Seeding is **idempotent (seed-on-empty)**.
- **Run it**: `docker compose up --build` (one click) — see `README.md`.

## Repository Layout

- `docker-compose.yml`: one-click stack (mongo + backend + frontend).
- `CRITERIA.md`: course criteria mapped to where each is fulfilled.
- `README.md`: human-facing summary and quick start.
- `start.sh`: non-Docker local startup (backend + frontend).
- `pictures/`: static images served by the backend at `/pictures`.
- `.editorconfig`, `.prettierrc.json`: shared formatting (run `npm run format` in either app).

### Backend (`backend/`)

- `server.js`: thin entrypoint — builds HTTP server, `initSocket`, `connectDB`, then listens.
- `app.js`: builds the Express app (CORS, JSON, static `/pictures`, `req.io` shim, route mounts, `notFound` + `errorHandler` last).
- `config/db.js`: connect to `MONGO_URI` (or in-memory fallback) + `seedIfEmpty()`.
- `config/socket.js`: `initSocket` / `getIo` / `emitAdoptionAlert` (the `new_adoption_alert` event).
- `controllers/*.controller.js`: request-handling logic (user, pet, post, event, product).
- `routes/*.js`: thin routers mapping verbs → controllers, wrapped in `asyncHandler`.
- `middleware/`: `auth.js` (JWT), `asyncHandler.js`, `error.js` (`notFound` + `errorHandler`).
- `models/*.js`: Mongoose schemas (`User`, `Pet`, `Post`, `Event`, `Product`).
- `seed/`: `index.js` orchestrator + per-entity `*.seed.js` (passwords are bcrypt-hashed).

### Frontend (`frontend/`)

- `src/main.js`: bootstrap — installs **Pinia before Router**, then mounts.
- `src/App.vue`: thin shell (`AppHeader` / `ToastNotification` / `<RouterView>` / `AppFooter`); calls `useSocket()`.
- `src/router/`: `routes.js` (table), `guards.js` (`authGuard` reads the auth store), `index.js`.
- `src/stores/`: Pinia — `auth.js` (token/user source of truth), `notifications.js` (toast).
- `src/services/`: `http.js` (fetch wrapper) + per-domain services (`auth`, `users`, `pets`, `posts`, `events`, `products`).
- `src/composables/`: `useAuth.js` (thin shim over the auth store), `useSocket.js` (Socket.IO → notifications store).
- `src/components/`: `layout/` (header, footer), `ui/` (toast, skeleton), `pets/`, `events/`, `products/`.
- `src/models/*.js`: JSDoc typedefs. `src/views/*.vue`: pages. `src/config/api.js`: `API_BASE_URL` / `WS_URL`. `src/utils/media.js`: `resolveMediaUrl`.

## Runtime Contracts

- **API base**: `http://localhost:5001/api`. Resources: `/users`, `/pets`, `/posts`, `/events`, `/products` (+ `/health`).
- **Auth**: login/register return a JWT; send it as `Authorization: Bearer <token>`. `auth` middleware populates `req.user` (`{ id, role }`). Protected: `POST /pets|posts|events|products`, `GET /users/me`, `PUT /users/:id` (self only).
- **WebSocket**: server emits `new_adoption_alert` when an adoptable pet is created (`config/socket.js` → `pet.controller.js`); the frontend `useSocket` composable feeds the notifications store → `ToastNotification.vue`. **Do not rename this event without updating both sides.**

## Code Patterns to Follow

### Backend
- ESM only (`"type": "module"`). No CommonJS.
- Controllers hold logic; routes stay thin and wrap handlers in `asyncHandler` (no per-handler try/catch — throw and let `errorHandler` respond).
- Use `findByIdAndUpdate(..., { new: true, runValidators: true })` for updates.
- Add a resource: model in `models/` → controller in `controllers/` → thin router in `routes/` → mount in `app.js` → optional seed in `seed/` (wire into `seed/index.js`).
- Preserve the in-memory fallback and `new_adoption_alert` contract.

### Frontend
- Vue SFCs with `<script setup>` + Composition API.
- **Never call `fetch` directly in a view** — go through a service in `src/services/`. Add new endpoints there.
- Auth/session state comes from `useAuthStore()` (or the `useAuth()` shim). Toasts via `useNotificationsStore()`.
- Protected pages use `meta.requiresAuth`; the global `authGuard` enforces it.
- Styling is Tailwind utilities in templates. Keep the rounded-card / bold-heading visual language.
- Env-driven config via `import.meta.env.VITE_*` surfaced through `src/config/api.js`.

## Out of Scope / Caution

- Don't commit `.env` secrets (only `.env.example` / public `VITE_` values).
- Don't remove the in-memory DB fallback or break `seedIfEmpty` idempotency.
- Don't rename `new_adoption_alert` without updating server + client.
- Keep ports consistent (backend 5001, frontend 5173) unless intentionally adding config.
