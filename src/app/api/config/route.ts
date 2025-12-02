import { NextResponse } from "next/server";
import { get_config } from "@/lib/config";

export async function GET() {
  const config = await get_config();
  return NextResponse.json(config);
}
