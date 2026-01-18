// Centralized API Configuration
// Update this URL when switching between environments

// Main generation API (FastAPI backend)
export const API_BASE_URL = 'https://script-pwal.onrender.com';

// Auth API (same backend)
export const AUTH_API_BASE = 'https://script-pwal.onrender.com';

// Free tier limit for new users
export const FREE_CREDIT_LIMIT = 3;

// Telegram bot for payment redirects
export const TELEGRAM_BOT_URL = 'https://t.me/payment_scenBot';

// Build payment URL with user ID
export const getPaymentUrl = (userId: string) => `${TELEGRAM_BOT_URL}?start=${userId}`;
