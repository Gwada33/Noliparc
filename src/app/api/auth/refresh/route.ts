import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/db';
import { verifyToken, signAccessToken, signRefreshToken } from '@/lib/jwt';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { message: "Aucun token de rafraîchissement trouvé" },
        { status: 401 }
      );
    }

    // Verify the refresh token
    let payload: any;
    try {
      payload = verifyToken(refreshToken, process.env.REFRESH_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { message: "Token de rafraîchissement invalide" },
        { status: 401 }
      );
    }

    // Validate token in database
    const { rows } = await client.query(
      `SELECT * FROM refresh_tokens 
       WHERE token=$1 
       AND expires_at > NOW() 
       AND is_revoked = FALSE`,
      [refreshToken]
    );

    if (!rows.length) {
      return NextResponse.json(
        { message: "Token de rafraîchissement expiré ou invalide" },
        { status: 401 }
      );
    }

    // Generate new tokens
    const newAccessToken = signAccessToken({
      sub: payload.sub,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName
    });

    const newRefreshToken = uuidv4();
    const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Revoke old token and create new one
    await client.query(
      `UPDATE refresh_tokens 
       SET is_revoked = TRUE 
       WHERE token = $1`,
      [refreshToken]
    );

    await client.query(
      `INSERT INTO refresh_tokens (id, user_id, token, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [newRefreshToken, payload.sub, newRefreshToken, newExpiry]
    );

    // Set response with new tokens
    const res = NextResponse.json({ 
      message: "Tokens rafraîchis avec succès",
      accessToken: newAccessToken
    });

    // Set new refresh token cookie
    res.cookies.set({
      name: 'refreshToken',
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      path: "/"
    });

    return res;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors du rafraîchissement du token" },
      { status: 500 }
    );
  }
}
