"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import content from "@/data/texts.json";
import { useAuth, User } from "@/app/context/AuthContext";
import { FiUser, FiLogOut } from 'react-icons/fi';
import { FaUserShield } from 'react-icons/fa';
import clsx from 'clsx';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

interface NavItem {
  link: string;
  label: string;
  button?: boolean;
}

interface HeaderContent {
  nav: Record<string, NavItem>;
  brand: string;
  'image-noli': string;
}

interface NavbarProps {
  user: User | null;
  logout: () => Promise<void>;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (confirmLogout) {
      try {
        await logout();
        router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    setConfirmLogout(!confirmLogout);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="logo">
        <Link href="/" className="logo-link">
          <Image
            src={content.header["image-noli"]}
            alt="Logo Noliparc"
            width={50}
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
              className={navItem.button ? "btn-primary nav-link" : "nav-link"}
              onClick={() => setMenuOpen(false)}
              role="menuitem"
              tabIndex={menuOpen ? 0 : -1}
            >
              {navItem.label}
            </Link>
          </li>
        ))}

        {user ? (
          <>
            {user.role === 'admin' && (
              <li role="none">
                <Link
                  href="/admin"
                  className="btn-nav"
                  role="menuitem"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => setMenuOpen(false)}
                >
                  <FaUserShield aria-hidden="true" />
                  <span className="user-label">Admin</span>
                </Link>
              </li>
            )}
            <li className="user-menu" role="none">
              <button
                className="btn-nav"
                onClick={() => setConfirmLogout(true)}
                role="menuitem"
                tabIndex={menuOpen ? 0 : -1}
                type="button"
              >
                <FiUser aria-hidden="true" /> {/* Icône utilisateur */}
                <span className="user-label">Déconnexion</span>
              </button>
            </li>
          </>
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
                S'inscrire
              </Link>
            </li>
          </>
        )}
      </ul>

      <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <DialogTitle>Confirmation de déconnexion</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir vous déconnecter ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogout(false)}>Annuler</Button>
          <Button onClick={handleLogout} color="error">Déconnexion</Button>
        </DialogActions>
      </Dialog>
    </nav>
  );  
}