// Centralized API Configuration
// Update this URL when switching between environments

export const API_BASE_URL = 'https://scenaries.onrender.com';

// Free tier limit for new users
export const FREE_CREDIT_LIMIT = 3;

// Telegram bot for payment redirects
export const TELEGRAM_BOT_URL = 'https://t.me/payment_scenBot';

// Build payment URL with user ID
export const getPaymentUrl = (userId: string) => `${TELEGRAM_BOT_URL}?start=${userId}`;
