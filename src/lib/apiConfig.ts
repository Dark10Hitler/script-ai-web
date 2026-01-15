// Centralized API Configuration
// Update this URL when switching between environments

export const API_BASE_URL = 'https://paymentsbot.onrender.com';

// Telegram bot for payment redirects
export const TELEGRAM_BOT_URL = 'https://t.me/EducationGPT_AIBot';

// Build payment URL with user ID
export const getPaymentUrl = (userId: string) => `${TELEGRAM_BOT_URL}?start=${userId}`;
