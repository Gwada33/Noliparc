import { NextResponse } from "next/server";

interface LogoutResponse {
  message: string;
  success: boolean;
}

export async function POST(): Promise<NextResponse<LogoutResponse>> {
  try {
    // Clear the access token cookie
    const response = NextResponse.json({
      message: "Déconnecté avec succès",
      success: true
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    // Set the cookies using NextResponse.cookies
    response.cookies.set('accessToken', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    // Clear any other auth-related cookies
    response.cookies.set('refreshToken', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return response;

  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return NextResponse.json({
      message: "Erreur lors de la déconnexion",
      success: false
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}
