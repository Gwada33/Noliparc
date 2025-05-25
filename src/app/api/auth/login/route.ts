import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {client} from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET!;
const ONE_HOUR = 60 * 60;          // en secondes
const COOKIE_NAME = "accessToken"; // vous choisissez

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // … (vérif email + mdp, cf. votre code précédent)
  const { rows } = await client.query(
    "SELECT id, password, first_name, last_name FROM users WHERE email=$1",
    [email]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: "Identifiants invalides" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      sub: user.id,                // identifiant
      email,
      firstName: user.first_name,
      lastName : user.last_name,
    },
    JWT_SECRET,
    { expiresIn: ONE_HOUR }
  );

  /* ---------- réponse avec cookie HttpOnly ---------- */
  const res = NextResponse.json({ message: "Connecté" });
  res.cookies.set({
    name     : COOKIE_NAME,
    value    : token,
    httpOnly : true,
    maxAge   : ONE_HOUR,
    sameSite : "lax",   // ou "strict" en fonction des besoins
    secure   : process.env.NODE_ENV === "production",
    path     : "/",
  });
  return res;
}
