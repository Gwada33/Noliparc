import { client } from "@/lib/db";

export async function logActivity(userId: number, action: string, details: any = {}, ip?: string) {
  try {
    await client.query(
      `INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)`,
      [userId, action, JSON.stringify(details), ip || null]
    );
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
