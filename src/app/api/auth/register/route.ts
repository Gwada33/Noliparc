import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { client } from "@/lib/db";
import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const logoUrl = "https://i.imgur.com/ahQpl7N.png";

async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  if (!to || !subject || !html) {
    throw new Error("Champs manquants pour l'envoi de mail");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Noliparc Contact" <contact@noliparc.com>',
    to,
    subject,
    html,
  });
}

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
    }: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Vérifie si l'email existe déjà
    const { rows } = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (rows.length > 0) {
      return NextResponse.json(
        { message: "Email déjà utilisé" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insert = await client.query(
      `
      INSERT INTO users(email, password, first_name, last_name, phone)
      VALUES($1, $2, $3, $4, $5)
      RETURNING id, email, first_name AS "firstName", last_name AS "lastName", phone, created_at AS "createdAt";
      `,
      [email, passwordHash, firstName || null, lastName || null, phone || null]
    );

    const user = insert.rows[0];

    // ✉️ Envoi de l'email de bienvenue
    await sendEmail({
      to: user.email,
      subject: "Bienvenue chez Noliparc ! 🎉",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <div style="text-align: center;">
        <img src="${logoUrl}" alt="Noliparc Logo" style="max-height: 120px; margin-bottom: 20px;" />
      </div>

      <h2 style="color: #4CAF50;">🎉 Bienvenue ${user.firstName || ""} !</h2>

      <p>Votre compte <strong>Noliparc</strong> a bien été créé.</p>

      <p>Pour suivre toutes nos actualités, coulisses et événements en avant-première,
      rejoignez-nous dès maintenant sur nos réseaux sociaux :</p>

  <div style="display: flex; align-items: center; width: 80%; gap: 20px; flex-direction: row; justify-content: center; margin: 30px 0;">
  <a href="https://www.facebook.com/noliparc" style="display: inline-flex; align-items: center; gap: 8px; background: #4267B2; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-family: sans-serif; font-weight: bold;">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="currentColor">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0ZM26.5016 25.0542V38.1115H21.0991V25.0547H18.4V20.5551H21.0991V17.8536C21.0991 14.1828 22.6231 12 26.9532 12H30.5581V16.5001H28.3048C26.6192 16.5001 26.5077 17.1289 26.5077 18.3025L26.5016 20.5546H30.5836L30.1059 25.0542H26.5016Z" />
    </svg>
    Facebook
  </a>

  <a href="https://www.tiktok.com/@noliparc" style="display: inline-flex; align-items: center; gap: 8px; background: #000000; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-family: sans-serif; font-weight: bold;">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM55.4949 25.0138C53.9398 25.0159 52.3819 25.018 50.8188 25.0422L50.8204 25.0438C50.7793 30.4143 50.7819 35.7861 50.7845 41.1646C50.786 44.1708 50.7875 47.1791 50.7813 50.1904C50.7745 51.2001 50.7756 52.2087 50.7766 53.2168C50.7793 55.9293 50.7821 58.638 50.6329 61.3551C50.6112 62.1091 50.2329 62.7719 49.8656 63.4157C49.8363 63.467 49.8071 63.5181 49.7781 63.5692C48.5656 65.5459 46.3358 66.896 44.0091 66.921C40.4995 67.2319 37.2118 64.3583 36.7165 60.9394C36.7128 60.7719 36.7068 60.6033 36.7009 60.434C36.667 59.4697 36.6324 58.4863 36.9993 57.5877C37.5212 56.1063 38.5228 54.7969 39.8417 53.9422C41.648 52.6874 44.0638 52.4999 46.1311 53.1687C46.1311 51.8508 46.1536 50.5334 46.1761 49.2161C46.2063 47.4488 46.2365 45.6817 46.2123 43.9135C41.6871 43.0666 36.854 44.4979 33.4038 47.5028C30.3599 50.0826 28.3989 53.875 28.0238 57.8393C27.9817 58.8565 27.9988 59.8972 28.0488 60.9394C28.4801 65.8147 31.4412 70.3571 35.6493 72.8385C38.1884 74.3354 41.1652 75.148 44.145 74.9777C49.0031 74.8964 53.733 72.2916 56.4582 68.2961C58.152 65.8959 59.113 62.9973 59.2755 60.0847C59.3178 56.0836 59.3152 52.075 59.3125 48.0616C59.3112 45.9936 59.3098 43.9243 59.3146 41.854C60.3974 42.5619 61.5038 43.2541 62.6913 43.7916C65.418 45.0854 68.4369 45.7105 71.4418 45.8089V37.4194C68.2354 37.0616 64.9399 36.0037 62.6101 33.6926C60.2756 31.4378 59.1286 28.1892 58.9646 25C57.8089 25.0107 56.6527 25.0122 55.4949 25.0138Z" />
    </svg>
    TikTok
  </a>

  <a href="https://www.instagram.com/noliparc" style="display: inline-flex; align-items: center; gap: 8px; background: #E1306C; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-family: sans-serif; font-weight: bold;">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="currentColor">
      <path d="M24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0ZM18.7233 11.2773C20.0886 11.2152 20.5249 11.2 24.0012 11.2H23.9972C27.4746 11.2 27.9092 11.2152 29.2746 11.2773C30.6373 11.3397 31.5679 11.5555 32.384 11.872C33.2266 12.1987 33.9386 12.636 34.6506 13.348C35.3627 14.0595 35.8 14.7736 36.128 15.6155C36.4427 16.4294 36.6587 17.3595 36.7227 18.7222C36.784 20.0876 36.8 20.5238 36.8 24.0001C36.8 27.4764 36.784 27.9116 36.7227 29.277C36.6587 30.6391 36.4427 31.5695 36.128 32.3837C35.8 33.2253 35.3627 33.9394 34.6506 34.6509C33.9394 35.3629 33.2264 35.8013 32.3848 36.1283C31.5703 36.4448 30.6391 36.6605 29.2765 36.7229C27.9111 36.7851 27.4762 36.8003 23.9996 36.8003C20.5236 36.8003 20.0876 36.7851 18.7222 36.7229C17.3598 36.6605 16.4294 36.4448 15.615 36.1283C14.7736 35.8013 14.0595 35.3629 13.3483 34.6509C12.6365 33.9394 12.1992 33.2253 11.872 32.3834C11.5557 31.5695 11.34 30.6394 11.2773 29.2767C11.2155 27.9114 11.2 27.4764 11.2 24.0001C11.2 20.5238 11.216 20.0873 11.2771 18.7219C11.3384 17.3598 11.5544 16.4294 11.8717 15.6152C12.1997 14.7736 12.6371 14.0595 13.3491 13.348C14.0606 12.6363 14.7747 12.1989 15.6166 11.872C16.4305 11.5555 17.3606 11.3397 18.7233 11.2773Z" />
      <path d="M22.853 13.5067C23.0759 13.5064 23.3158 13.5065 23.5746 13.5066L24.0013 13.5067C27.4189 13.5067 27.824 13.519 29.1736 13.5803C30.4216 13.6374 31.0989 13.8459 31.5501 14.0211C32.1475 14.2531 32.5733 14.5305 33.0211 14.9785C33.4691 15.4265 33.7464 15.8532 33.979 16.4505C34.1542 16.9012 34.363 17.5785 34.4198 18.8265C34.4811 20.1759 34.4944 20.5812 34.4944 23.9972C34.4944 27.4133 34.4811 27.8186 34.4198 29.168C34.3627 30.416 34.1542 31.0933 33.979 31.544C33.747 32.1413 33.4691 32.5667 33.0211 33.0144C32.5731 33.4624 32.1477 33.7398 31.5501 33.9718C31.0995 34.1478 30.4216 34.3558 29.1736 34.4128C27.8242 34.4742 27.4189 34.4875 24.0013 34.4875C20.5834 34.4875 20.1783 34.4742 18.8289 34.4128C17.5809 34.3552 16.9036 34.1467 16.4521 33.9715C15.8548 33.7395 15.4281 33.4621 14.9801 33.0141C14.5321 32.5661 14.2548 32.1405 14.0222 31.5429C13.847 31.0923 13.6382 30.4149 13.5814 29.1669C13.5201 27.8176 13.5078 27.4122 13.5078 23.994C13.5078 20.5759 13.5201 20.1727 13.5814 18.8233C13.6385 17.5753 13.847 16.898 14.0222 16.4468C14.2542 15.8494 14.5321 15.4228 14.9801 14.9748C15.4281 14.5268 15.8548 14.2494 16.4521 14.0169C16.9033 13.8409 17.5809 13.6329 18.8289 13.5755C20.0097 13.5222 20.4674 13.5062 22.853 13.5035V13.5067ZM30.8339 15.6321C29.9859 15.6321 29.2978 16.3193 29.2978 17.1676C29.2978 18.0156 29.9859 18.7036 30.8339 18.7036C31.6819 18.7036 32.3699 18.0156 32.3699 17.1676C32.3699 16.3196 31.6819 15.6316 30.8339 15.6316V15.6321ZM17.4279 24.0002C17.4279 20.3701 20.3709 17.4269 24.001 17.4268C27.6312 17.4268 30.5736 20.37 30.5736 24.0002C30.5736 27.6304 27.6314 30.5723 24.0013 30.5723C20.3711 30.5723 17.4279 27.6304 17.4279 24.0002Z" />
      <path d="M24.0012 19.7334C26.3575 19.7334 28.2679 21.6436 28.2679 24.0001C28.2679 26.3564 26.3575 28.2668 24.0012 28.2668C21.6447 28.2668 19.7345 26.3564 19.7345 24.0001C19.7345 21.6436 21.6447 19.7334 24.0012 19.7334Z" />
    </svg>
    Instagram
  </a>
</div>







      <p style="margin-top: 30px;">
        Merci de faire partie de la grande aventure <strong>Noliparc</strong> 💛<br />
        À très bientôt sur nos plateformes !
      </p>

      <p style="font-size: 13px; color: #999; margin-top: 20px;">
        — L’équipe Noliparc
      </p>
    </div>
  `,
    });

    return NextResponse.json(
      { message: "Utilisateur créé", user },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/register error", err);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
