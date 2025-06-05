import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { client } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
import { AUTH_CONFIG } from "@/lib/constants";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { rows } = await client.query(
      "SELECT id, password, first_name, last_name FROM users WHERE email=$1",
      [email]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Identifiants invalides" }, 
        { status: 401 }
      );
    }

    // Generate access token
    const accessToken = jwt.sign(
      {
        sub: user.id,
        email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      AUTH_CONFIG.JWT_SECRET,
      { 
        expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRY,
        algorithm: "HS256"
      }
    );

    // Generate refresh token
    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRY * 1000);

    // Store refresh token in database
    await client.query(
      `INSERT INTO refresh_tokens (token, user_id, expires_at) 
       VALUES ($1, $2, $3)`,
      [refreshToken, user.id, expiresAt]
    );

    // Set response with both tokens
    const res = NextResponse.json({ 
      message: "Connecté",
      user: {
        id: user.id,
        email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });

    // Set access token cookie
    res.cookies.set({
      name: AUTH_CONFIG.ACCESS_TOKEN_COOKIE,
      value: accessToken,
      httpOnly: true,
      maxAge: AUTH_CONFIG.ACCESS_TOKEN_EXPIRY,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // Set refresh token cookie
    res.cookies.set({
      name: AUTH_CONFIG.REFRESH_TOKEN_COOKIE,
      value: refreshToken,
      httpOnly: true,
      maxAge: AUTH_CONFIG.REFRESH_TOKEN_EXPIRY,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la connexion" },
      { status: 500 }
    );
  }
}
