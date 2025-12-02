"use client";

import React, { useEffect, useState } from "react";
import "@/css/snow.css";

export default function SnowEffect() {
  const [flakes, setFlakes] = useState<{ id: number; left: string; duration: string; delay: string; size: string }[]>([]);

  useEffect(() => {
    // Only run on client to avoid hydration mismatch
    const newFlakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      duration: `${Math.random() * 5 + 5}s`, // 5-10 seconds
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 1 + 1}rem`,
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div aria-hidden="true">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            fontSize: flake.size,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}
