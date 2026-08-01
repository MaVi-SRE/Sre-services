// Central API configuration.
//
// Default: same-origin ('') — the API runs as Vercel serverless functions in
// this same project (see /api), so requests go to /api/* on the same domain.
// Override with VITE_API_BASE_URL only to point at a separate backend (e.g. a
// local `vercel dev` on another port, or the old Render service).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const SUPPORT_EMAIL = 'support@mavisolution.com';

// Serverless cold starts + model latency — allow a generous ceiling.
export const REQUEST_TIMEOUT_MS = 60_000;

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;
