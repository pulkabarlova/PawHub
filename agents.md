# PawHub Agent Guide

This file documents how to work safely and consistently in this repository.

## Project Overview

- **Type**: Full-stack monorepo (`frontend` + `backend`)
- **Domain**: Pet adoption and community platform
- **Frontend**: Vue 3 + Vite + Vue Router + Tailwind CSS v4
- **Backend**: Node.js + Express + Mongoose + Socket.IO
- **Database behavior**: Tries local MongoDB first, falls back to in-memory MongoDB and seeds data automatically

## Repository Layout

- `README.md`: Human-facing project summary and quick start.
- `start.sh`: One-command local startup for backend + frontend.
- `pictures/`: Static image assets served by backend at `/pictures`.
- `backend/`: Express API and Mongo models.
- `frontend/`: Vue SPA.
- `hw-03/`: Separate coursework artifact; not part of main app runtime.

### Backend Layout

- `backend/server.js`: App bootstrap, DB connection strategy, route registration, Socket.IO setup.
- `backend/seedData.js`: Seed logic used when in-memory DB starts.
- `backend/middleware/auth.js`: JWT auth middleware.
- `backend/models/*.js`: Mongoose schemas (`User`, `Pet`, `Post`, `Event`).
- `backend/routes/*.js`: Resource routers (`users`, `pets`, `posts`, `events`).
- `backend/package.json`: Node scripts and dependencies.

### Frontend Layout

- `frontend/src/main.js`: Vue app mount and router registration.
- `frontend/src/App.vue`: Shell layout (header/footer/mobile nav) and websocket notification listener.
- `frontend/src/router/index.js`: Route declarations + auth navigation guard.
- `frontend/src/composables/useAuth.js`: Shared token/user state via localStorage.
- `frontend/src/views/*.vue`: Page-level views (Home, Login, Register, Adoption, Community, Events, UserProfile, PetProfile).
- `frontend/src/style.css`: Tailwind entrypoint.
- `frontend/vite.config.js`: Vite plugins for Vue + Tailwind.

## Packages and Tooling

### Backend Dependencies

- `express`: HTTP API framework.
- `mongoose`: MongoDB ODM.
- `mongodb-memory-server`: Local in-memory DB fallback.
- `socket.io`: Realtime server events.
- `cors`: Cross-origin support.
- `dotenv`: Environment variable loading.
- `jsonwebtoken`: JWT generation/verification.
- `bcryptjs`: Password hashing.
- `nodemon` (devDependency): Auto-restart in development.

### Frontend Dependencies

- `vue`: Core framework.
- `vue-router`: SPA routing and route guards.
- `socket.io-client`: Realtime event listener from backend.
- `lucide-vue-next`: Icon components.
- `vite`: Build/dev server.
- `@vitejs/plugin-vue`: Vue SFC support in Vite.
- `tailwindcss` + `@tailwindcss/vite`: Styling system.

## Commands

### Unified Start

From repo root:

- `chmod +x start.sh` (once)
- `./start.sh`

This installs deps (both apps), starts backend on `5000`, then frontend on `5173`.

### Backend

From `backend/`:

- `npm install`
- `npm start` (node server)
- `npm run dev` (nodemon)

### Frontend

From `frontend/`:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Runtime Contracts

### Backend API Base

- `http://localhost:5000/api`

### Routes

- `/pets`
- `/users`
- `/posts`
- `/events`

### Auth Pattern

- Login/register return JWT token.
- Token is sent as `Authorization: Bearer <token>`.
- Middleware reads token from header and populates `req.user`.
- Protected endpoints currently include:
  - `POST /api/pets`
  - `POST /api/posts`
  - `GET /api/users/me`
  - `PUT /api/users/:id` (self-update only)

### WebSocket Pattern

- Server emits `new_adoption_alert` when a new pet is created with `status === "adoptable"`.
- Frontend `App.vue` listens and shows temporary toast notification.

## Code Patterns to Follow

### Backend Patterns

- Use ESM imports/exports (`"type": "module"`).
- Keep route handlers async and wrapped in `try/catch`.
- Return JSON consistently with meaningful HTTP status codes.
- For update operations, use `findByIdAndUpdate(..., { new: true, runValidators: true })`.
- If route requires identity context, use `auth` middleware and rely on `req.user.id`.
- Add new routers by:
  1. Creating model in `backend/models`.
  2. Creating route file in `backend/routes`.
  3. Registering route prefix in `backend/server.js`.

### Frontend Patterns

- Use Vue SFCs with `<script setup>`.
- Use Composition API primitives (`ref`, `computed`, `onMounted`).
- Fetch API is used directly (no centralized API client yet).
- Authentication state comes from `useAuth()` composable.
- Protected pages use `meta.requiresAuth` with router guard enforcement.
- Tailwind utility classes define almost all styling directly in templates.

## File and Change Guidance for Agents

- Prefer focused edits in existing modules over large rewrites.
- Preserve existing UI style language (rounded cards, bold headings, Tailwind utilities).
- Keep API paths and ports consistent unless intentionally introducing config support.
- When adding authenticated requests in frontend, use `useAuth().getHeaders()`.
- Avoid introducing CommonJS syntax; stay ESM across backend/frontend.
- If adding new environment variables, document them in `README.md` and keep sensible local defaults.

## Known Architecture Notes

- DB fallback logic is core behavior: do not remove in-memory fallback unless requested.
- `pictures/` is served statically; image URLs may be absolute URLs or local `/pictures/...` paths.
- `useAuth` stores state in module-scope refs + localStorage; this is shared app-wide.
- API base URLs are hardcoded to `http://localhost:5000` in views; consider centralizing only if requested.

## Quick Task Playbooks

### Add a New Backend Resource

1. Add Mongoose schema in `backend/models`.
2. Add CRUD router in `backend/routes`.
3. Mount route in `backend/server.js`.
4. Seed sample data if needed in `backend/seedData.js`.

### Add a New Frontend Page

1. Create view in `frontend/src/views`.
2. Register route in `frontend/src/router/index.js`.
3. Add navigation entry in `frontend/src/App.vue` if user-facing.
4. Use existing card/section style patterns for visual consistency.

### Add an Authenticated Client Action

1. Read token via `useAuth()`.
2. Send `Authorization` header with `getHeaders()`.
3. Handle non-OK responses by reading `{ error }` payload.

## Out of Scope / Caution Areas

- Do not commit `.env` secrets.
- Do not assume local MongoDB is available.
- Do not break WebSocket event name `new_adoption_alert` without updating both server and client.
- Do not modify `hw-03` unless task explicitly asks for it.
