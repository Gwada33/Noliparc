import jwt from 'jsonwebtoken';

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 60 * 60, // 1 hour in seconds
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
  JWT_SECRET: process.env.JWT_SECRET!,
  REFRESH_SECRET: process.env.REFRESH_SECRET!
};

export function signAccessToken(payload: {
  sub: string;
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  return jwt.sign(
    payload,
    JWT_CONFIG.JWT_SECRET,
    {
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      algorithm: 'HS256'
    }
  );
}

export function signRefreshToken(payload: { sub: string }) {
  return jwt.sign(
    payload,
    JWT_CONFIG.REFRESH_SECRET,
    {
      expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
      algorithm: 'HS256'
    }
  );
}

export function verifyToken(token: string, secret: string = JWT_CONFIG.JWT_SECRET) {
  try {
    const decoded = jwt.verify(token, secret) as {
      sub: string;
      email: string;
      firstName?: string;
      lastName?: string;
      iat: number;
      exp: number;
    };
    
    if (!decoded.sub || !decoded.email) {
      throw new Error('Invalid token payload');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
