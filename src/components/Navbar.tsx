// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import content from "../../public/texts.json";
import { useAuth } from "@/app/context/AuthContext";
import { FiUser } from 'react-icons/fi'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">
          <img
            src={content.header["image-noli"]}
            alt="Logo Noliparc"
            className="logo-img"
          />
          {content.header.brand}
        </Link>
      </div>

      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        {Object.entries(content.header.nav).map(([key, navItem]) => (
          <li key={key}>
            <Link
              href={navItem.link}
              className={navItem.button ? "btn-primary btn-nav" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {navItem.label}
            </Link>
          </li>
        ))}

        {user ? (
          // Si connecté, on affiche son prénom + déconnexion
          <li className="user-menu">
            <button className="btn-nav" onClick={() => logout()}>
              Déconnexion
            </button>
          </li>
        ) : (
          // Sinon, lien vers login/register
          <>
            <li>
              <Link href="/login" className="btn-nav">
                Se connecter
              </Link>
            </li>
            <li>
              <Link href="/register" className="register">
                S’inscrire
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
