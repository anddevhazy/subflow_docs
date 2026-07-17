export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://monnify-subscription-engine.onrender.com";

export const SWAGGER_URL = `${API_BASE_URL}/docs`;

export const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ??
  "https://monnify-subscription-engine-dashboard.vercel.app/";

export const TEST_API_KEY =
  "nsub_test_7f3a9c2e1b8d4f6a0e5c3d2b1a9f8e7d6c5b4a3f";
