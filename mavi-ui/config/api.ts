// Central API configuration.
// Override per-environment with VITE_API_BASE_URL in .env / .env.local.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://sre-services.onrender.com';

export const SUPPORT_EMAIL = 'support@mavisolution.com';

// Render free instances cold-start slowly, so allow a generous ceiling.
export const REQUEST_TIMEOUT_MS = 60_000;

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;
