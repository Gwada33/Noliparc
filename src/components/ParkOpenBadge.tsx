"use client";

import { useEffect, useState } from "react";

type Status = "open" | "closed" | "maintenance";

interface OpenStatus {
  status: Status;
  source: string;
  label: string;
}

export default function ParkOpenBadge() {
  const [data, setData] = useState<OpenStatus | null>(null);

  useEffect(() => {
    fetch("/api/open-status")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  const tone =
    data.status === "open"
      ? "open"
      : data.status === "closed"
        ? "closed"
        : "maintenance";

  return (
    <div
      className={`open-badge open-badge--${tone}`}
      role="status"
      aria-live="polite"
      aria-label={`Le parc est actuellement ${data.label.toLowerCase()}`}
    >
      <span className="open-badge__dot" aria-hidden="true" />
      <span className="open-badge__label">{data.label} actuellement</span>
    </div>
  );
}
