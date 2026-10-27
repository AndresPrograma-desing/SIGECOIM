# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SIGECOIM — Sistema de Información para la Gestión Administrativa del Comodato de Instrumentos Musicales. Digitalizes instrument inventory and comodato (free-loan) contracts for a children's symphonic institution ("Núcleo de la Sinfónica Infantil"). Full domain/module description, roles table, and business rules live in [README.md](README.md) — read it for product context before changing business logic.

Monorepo with two independently-run halves: a Node/Express/Sequelize API at the repo root, and a React/Vite client in `client/`.

## Commands

Backend (run from repo root):
```bash
pnpm install
node src/models/sync.js   # one-time: create tables + seed data (requires MySQL/XAMPP running, sigecoim_db created)
pnpm dev                  # node --watch server.js, http://localhost:3003
pnpm start                # plain node server.js
```

Frontend (run from `client/`):
```bash
pnpm install
pnpm dev       # vite, http://localhost:5173
pnpm build
pnpm lint      # oxlint
pnpm preview
```

No test suite exists in either package.

Backend `.env` (repo root) requires `PORT`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`.

## Architecture

### Backend (repo root `src/`)
Standard layered Express app: `routes/` → `controllers/` → `models/` (Sequelize), plus `middlewares/authMiddleware.js` for JWT auth and `config/db.js` for the MySQL connection.

- **DB schema is not migration-based.** `config/db.js` calls `sequelize.sync({ alter: true })` on every boot — the schema self-heals from the model definitions. There are no migration files to write; changing a model's fields is enough. `src/models/sync.js` is a standalone script (not imported by `server.js`) used only once per fresh environment to create tables and seed data.
- **`src/models/index.js` is the single source of truth for associations** (`Representante`→`Estudiante`→`Comodato`→`Instrumento`/`Devolucion`/`Usuario`) and is the only place that should export models for controllers to import from (`import { Usuario, Comodato, ... } from '../models/index.js'`).
  - **Known gap:** `Solicitud` (used by `src/controllers/solicitudController.js`) is not imported/exported in `models/index.js`, and `src/routes/solicitudRoutes.js` is not mounted in `server.js`. The solicitud (student self-service loan request) feature is wired end-to-end in its own files but currently dead code from the server's perspective — if asked to finish or debug "solicitudes", start by wiring these two.
- **Auth has two distinct JWT shapes.** `authMiddleware.requireTipo('STAFF'|'ESTUDIANTE')` gates by account type (staff login via `authController.login` vs. student accounts), while `requireRol('ANALISTA_BIENES', 'COORDINADOR')` gates staff-only actions by role. Check which one a route needs — they are not interchangeable.
- Business rule to preserve when touching comodatos/instrumentos: an `Instrumento` in `PRESTADO` cannot be attached to a new `Comodato`; deleting an active `Comodato` must release the instrument back to `DISPONIBLE`; approving a `Solicitud` must create the `Comodato` and flip the instrument state inside the same DB transaction (see `comodatoController.generarFolioContrato` + `solicitudController.aprobarSolicitud` for the pattern).

### Frontend (`client/src/`)
React 19 + Vite, MUI, React Router, served from `client/`.

- **UI building blocks come from the `anteriority-ui` npm package**, not from local primitives — this is a shared internal design-system library (see [AnteriorityUI.md](AnteriorityUI.md) for the full per-component prop reference: `AlertModal`, `Selector`, `TextField`, etc.). Prefer its components over hand-rolled MUI usage when an equivalent exists.
- `anteriority-ui` also supplies shared infra, not just visual components: `client/src/services/apiClient.js` configures the shared HTTP client via `anteriority-ui/common/api/client`'s `configureApiClient`, rather than the project instantiating its own axios instance.
- **Dynamic API base URL resolution** (`apiClient.js`): `localhost`/`127.0.0.1` → `http://localhost:3003/api`; a `*.devtunnels.ms` hostname → same tunnel host with `-5173` swapped for `-3003`; anything else (LAN IP) → same hostname on port 3003. This is what lets the app be tested from a phone on the same Wi-Fi or over a dev tunnel without code changes — don't hardcode a base URL elsewhere.
- Auth token/user are persisted to `localStorage` under `sigecoim_token` / `sigecoim_usuario` and read by `AuthContext` (`client/src/context/AuthContext.jsx`), which exposes `usuario`, `login`, `logout`, and the derived `puedeAdministrarUsuarios` flag (`rol === 'ADMINISTRADOR' || 'ANALISTA_BIENES'`) used to gate the users-admin module.
- Route guarding (`client/src/routes/ProtectedRoute.jsx`): `ProtectedRoute` requires any logged-in `usuario`; `AdminRoute` additionally requires `puedeAdministrarUsuarios`, redirecting to `/estudiantes` otherwise.
- Per-service API calls live under `client/src/services/` (`auth.js`, `comodatos.js`, `estudiantes.js`, `instrumentos.js`, `usuarios.js`, `configuracion.js`) — one file per backend resource, all built on `apiClient.js`.
- `client/src/pages/modules/` holds the per-module page composition (list + form + table wiring); reusable form/table/dialog components live in `client/src/components/`.
