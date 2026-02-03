// select environment from .env
const ENV = process.env.EXPO_PUBLIC_ENVIRONMENT || 'lan';

// Map environments to their specific URLs
const API_URLS = {
    lan: process.env.EXPO_PUBLIC_API_URL_LAN,
    development: process.env.EXPO_PUBLIC_API_URL_DEVELOPMENT,
    production: process.env.EXPO_PUBLIC_API_URL_PRODUCTION,
};

// Log the active connection for debugging
console.log(`[API Config] Active Environment: ${ENV}`);
console.log(`[API Config] Base URL: ${API_URLS[ENV]}`);

export const API_BASE = API_URLS[ENV] || API_URLS.lan;
