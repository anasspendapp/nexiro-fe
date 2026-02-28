# GitHub Copilot Instructions — Nexiro FE

## Project Overview

Nexiro is an AI-powered image enhancement SaaS. This is the React frontend, deployed to Firebase Hosting and backed by a REST API at `https://api.nexiro.io/api`.

---

## Tech Stack

| Layer        | Library / Tool                             |
| ------------ | ------------------------------------------ |
| UI Framework | React 19                                   |
| Language     | TypeScript 5.8 (strict)                    |
| Build Tool   | Vite 6                                     |
| Routing      | React Router v7                            |
| Server State | TanStack Query v5                          |
| HTTP Client  | Axios (with interceptors)                  |
| Styling      | Tailwind CSS                               |
| Auth         | Google OAuth (`@react-oauth/google`) + JWT |
| AI           | Google Gemini (`geminiService.ts`)         |
| Hosting      | Firebase                                   |

---

## Project Structure

```
App.tsx              # Root — routing, auth bootstrap, session hydration
index.tsx            # Entry point, wraps app in QueryProvider + AlertProvider
types.ts             # Shared TypeScript types and enums (single source of truth)
components/          # Reusable, presentational UI components
hooks/               # Custom TanStack Query hooks (useAPI.ts)
pages/               # Route-level page components
providers/           # React context providers (QueryProvider)
services/            # Side-effect logic: API calls, auth, Gemini
  api.ts             # Axios client + all API functions + transformUserData
  authService.ts     # Token/session helpers (localStorage)
  geminiService.ts   # Gemini AI integration
```

---

## Coding Conventions

### TypeScript

- Always type component props with an explicit `interface`, never inline.
- Use `React.FC<Props>` for functional components.
- Prefer `enum` for fixed value sets (see `PlanType`, `AppState`, `BackgroundMode` in `types.ts`).
- Export new shared types/enums from `types.ts`, not from component files.
- Avoid `any`; use `unknown` and narrow with type guards when type is uncertain.

### Components

- One component per file; filename matches the exported component name.
- Keep components in `components/` purely presentational — no direct API calls inside them.
- Use `children: React.ReactNode` for composable wrappers.
- Consume alerts/confirms exclusively through the `useAlert()` hook from `AlertProvider`, never use `window.alert` or `window.confirm`.

### State Management

- **Server state** (API data): use TanStack Query hooks from `hooks/useAPI.ts`.
- **Local UI state**: `useState` / `useReducer` inside the component.
- Do not use any global state library (Redux, Zustand, etc.) — the project relies on TanStack Query + React context.

### API & Data Fetching

- All API functions live in `services/api.ts` and use the shared `apiClient` Axios instance.
- Add new API calls as methods on the appropriate API object (`authAPI`, `userAPI`, `subscriptionAPI`, `usageAPI`, `imageAPI`).
- Wrap new API calls in a custom hook in `hooks/useAPI.ts` — use `useMutation` for writes/actions, `useQuery` for reads.
- The `apiClient` interceptor automatically attaches the JWT Bearer token from `localStorage` for non-public endpoints. Do not manually attach auth headers.
- Public endpoints (no auth header needed) must be registered in the `publicEndpoints` array inside the request interceptor in `api.ts`.

### Authentication & Session

- JWT token key: `nexiro_token` | User session key: `nexiro_user` (stored in `localStorage`).
- Always use `authService` methods (`saveToken`, `getToken`, `clearSession`, etc.) — never access `localStorage` for auth data directly.
- On 401 responses the interceptor in `api.ts` automatically clears the session; do not duplicate this logic elsewhere.

### Routing

- Protected routes must use the `ProtectedRoute` wrapper defined in `App.tsx`.
- Dashboard sub-routes are nested under `/dashboard` and defined inside `pages/Dashboard.tsx`.
- Add new top-level routes in `App.tsx`; add new dashboard sub-routes inside `Dashboard.tsx`.

### Styling (Tailwind CSS)

- Use Tailwind utility classes exclusively — no inline styles, no CSS modules, no plain CSS files unless absolutely necessary.
- The app uses a dark theme: base background is `bg-black`, text is `text-gray-200`.
- Interactive states use Indigo as the primary accent (`indigo-500`, `indigo-600`).
- Use `selection:bg-indigo-500 selection:text-white` on page wrappers for consistent text selection colour.
- Decorative background blobs are handled by the `<BackgroundBlobs />` component — reuse it on new full-page views instead of recreating it.

### Path Aliases

- Use the `@/` alias (maps to workspace root) for all cross-directory imports instead of deep relative paths.
  ```ts
  // Good
  import { User } from "@/types";
  // Avoid
  import { User } from "../../types";
  ```

---

## Plans & Credits

- Plan tiers: `PlanType.FREE`, `PlanType.STARTER`, `PlanType.PRO` (defined in `types.ts`).
- Credit and plan checks should always read from the `User` object — never hard-code plan names as strings.

---

## Environment Variables

- Env vars are loaded via Vite's `loadEnv`; prefix with `VITE_` for client-side exposure, or add them to the `define` block in `vite.config.ts` for legacy `process.env` access.
- The Gemini API key is exposed as `process.env.GEMINI_API_KEY` via `vite.config.ts`; do not commit `.env` files.

---

## Do's and Don'ts

**Do:**

- Run `yarn dev` to start the local dev server (port 3000).
- Run `yarn build` before `firebase deploy` (or use `yarn deploy`).
- Keep `types.ts` as the single source of truth for shared domain types.
- Use `transformUserData` from `api.ts` when converting raw API user payloads to the `User` type.
- Prefer small, focused components — extract sub-components when a component exceeds ~150 lines.

**Don't:**

- Don't import `pg` or any Node.js-only library in client-side code.
- Don't call `console.log` in production code paths (use it only for debugging, then remove it).
- Don't bypass `authService` to read/write auth tokens directly.
- Don't add heavy third-party UI libraries without discussion — the project intentionally keeps the dependency footprint small.
- Don't add new global providers without a clear justification; prefer co-located state.
