import { NextResponse } from "next/server";
import { get_config } from "@/lib/config";

// Ne jamais mettre en cache : l'état d'ouverture change au fil de la journée.
export const dynamic = "force-dynamic";

const PLACE_ID = process.env.GOOGLE_PLACE_ID ?? "";
const API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? "";

type OpenStatus = "open" | "closed" | "maintenance";

export async function GET() {
  const config = await get_config();

  if (config.maintenanceMode) {
    return NextResponse.json({
      status: "maintenance" as OpenStatus,
      source: "config",
      label: "Maintenance",
    });
  }

  // Source prioritaire : Google Maps (si une clé + un place_id sont configurés).
  if (API_KEY && PLACE_ID) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(
        `https://places.googleapis.com/v1/places/${PLACE_ID}`,
        {
          headers: {
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask":
              "displayName,currentOpeningHours,regularOpeningHours",
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const openNow = data?.currentOpeningHours?.openNow;

        if (typeof openNow === "boolean") {
          return NextResponse.json({
            status: (openNow ? "open" : "closed") as OpenStatus,
            source: "google",
            label: openNow ? "Ouvert" : "Fermé",
            periods: data?.currentOpeningHours?.periods ?? [],
            weekdayText: data?.currentOpeningHours?.weekdayDescriptions ?? [],
          });
        }
      }
    } catch (error) {
      console.error("Google Places open-status error:", error);
      // On retombe sur la config locale en cas d'échec.
    }
  }

  // Fallback : statut déclaré dans la configuration du parc.
  const status: OpenStatus = config.parkStatus === "closed" ? "closed" : "open";
  return NextResponse.json({
    status,
    source: "config",
    label: status === "open" ? "Ouvert" : "Fermé",
  });
}
