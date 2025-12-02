"use client";
import { useEffect, useState } from "react";

export default function GlobalBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("globalBannerDismissed");
      setVisible(!dismissed);
    } catch {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem("globalBannerDismissed", "1");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Annonce importante"
      style={{
        background: "#fff3e0",
        borderBottom: "1px solid #eee",
        padding: "8px 12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <img
        src="/images/flyers/fermeture.png"
        alt="Information importante"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <button
        onClick={handleClose}
        aria-label="Fermer l'annonce"
        style={{
          marginLeft: 8,
          border: "1px solid #ccc",
          background: "white",
          color: "#333",
          padding: "6px 10px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Fermer
      </button>
    </div>
  );
}

