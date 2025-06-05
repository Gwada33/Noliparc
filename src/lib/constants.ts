export const AUTH_CONFIG = {
  ACCESS_TOKEN_COOKIE: 'accessToken',
  REFRESH_TOKEN_COOKIE: 'refreshToken',
  ACCESS_TOKEN_EXPIRY: 60 * 60, // 1 hour in seconds
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
  JWT_SECRET: process.env.JWT_SECRET!,
  REFRESH_SECRET: process.env.REFRESH_SECRET!
};
