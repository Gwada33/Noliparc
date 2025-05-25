"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import content from "../../public/texts.json";
import { useAuth } from "@/app/context/AuthContext";
import { FiUser } from 'react-icons/fi';
import clsx from 'clsx'; // Si tu veux l'installer : npm i clsx

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="logo">
        <Link href="/" className="logo-link">
          <Image
            src={content.header["image-noli"]}
            alt="Logo Noliparc"
            width={50}  // adapte selon la taille souhaitée
            height={50}
            className="logo-img"
          />
          <span className="brand-name">{content.header.brand}</span>
        </Link>
      </div>

      <button
        className={clsx("hamburger", { open: menuOpen })}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="nav-links"
        type="button"
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>

      <ul
        id="nav-links"
        className={clsx("nav-links", { active: menuOpen })}
        role="menu"
      >
        {Object.entries(content.header.nav).map(([key, navItem]) => (
          <li key={key} role="none">
            <Link
              href={navItem.link}
              className={navItem.button ? "btn-primary btn-nav" : "nav-link"}
              onClick={() => setMenuOpen(false)}
              role="menuitem"
              tabIndex={menuOpen ? 0 : -1} // accessibilité clavier
            >
              {navItem.label}
            </Link>
          </li>
        ))}

        {user ? (
          <li className="user-menu" role="none">
            <button
              className="btn-nav"
              onClick={() => logout()}
              role="menuitem"
              tabIndex={menuOpen ? 0 : -1}
              type="button"
            >
              <FiUser aria-hidden="true" /> {/* Icône utilisateur */}
              <span className="user-label">Déconnexion</span>
            </button>
          </li>
        ) : (
          <>
            <li role="none">
              <Link
                href="/login"
                className="btn-nav"
                role="menuitem"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                Se connecter
              </Link>
            </li>
            <li role="none">
              <Link
                href="/register"
                className="register"
                role="menuitem"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                S’inscrire
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
