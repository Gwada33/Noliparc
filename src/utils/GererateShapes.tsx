import React, { useMemo } from "react";

type Variant = "default" | "login" | "anniversaire";

interface MagicPatternBackgroundProps {
  count?: number;
  variant?: Variant;
}

export default function MagicPatternBackground({
  count = 20,
  variant = "default",
}: MagicPatternBackgroundProps) {
  const className =
    variant === "login"
      ? "pattern-shape-login"
      : variant === "anniversaire"
      ? "pattern-shape-anniversaire"
      : "pattern-shape";

  const shapes = useMemo(() => {
    return [...Array(count)].map((_, i) => {
      const size = Math.floor(Math.random() * 300) + 50;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;

      return (
        <div
          key={i}
          className={className}
          style={{
            width: size,
            height: size,
            top: `${top}%`,
            left: `${left}%`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    });
  }, [className, count]); // 👈 Vide = génère UNE FOIS SEULEMENT

  return <div className="magicpattern-container">{shapes}</div>;
}
