"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import content from "@/data/texts.json";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthShell({
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card__logo">
          <Image
            src={content.header["image-noli"]}
            alt="Noliparc"
            width={56}
            height={56}
          />
        </div>
        <h2 className="auth-card__title">{title}</h2>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
