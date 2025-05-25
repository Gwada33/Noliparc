import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES_IN  = '15m';
const REFRESH_EXPIRES_IN = '30d';

export function signAccessToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: REFRESH_EXPIRES_IN });
}



export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
