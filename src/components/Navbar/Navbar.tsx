"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import content from "@/data/texts.json";
import { useAuth, User } from "@/app/context/AuthContext";
import { FiUser } from 'react-icons/fi';
import { FaUserShield } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

interface NavItem {
  link: string;
  label: string;
  button?: boolean;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const navbarClasses = [
    styles.navbar,
    scrolled ? styles.scrolled : ''
  ].filter(Boolean).join(' ');

  const hamburgerClasses = [
    styles.hamburger,
    menuOpen ? styles.open : ''
  ].filter(Boolean).join(' ');

  const navLinksClasses = [
    styles.navLinks,
    menuOpen ? styles.active : ''
  ].filter(Boolean).join(' ');

  return (
    <nav className={navbarClasses} role="navigation" aria-label="Main navigation">
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src={content.header["image-noli"]}
            alt="Logo Noliparc"
            width={50}
            height={50}
            className={styles.logoImg}
          />
          <span className={styles.brandName}>{content.header.brand}</span>
        </Link>
      </div>

      <button
        className={hamburgerClasses}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="nav-links"
        type="button"
      >
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </button>

      <ul
        id="nav-links"
        className={navLinksClasses}
        role="menu"
      >
        {Object.entries(content.header.nav).map(([key, navItem]) => (
          <li key={key} role="none">
            <Link
              href={(navItem as NavItem).link}
              className={(navItem as NavItem).button ? styles.navLinkPrimary : styles.navLink}
              onClick={() => setMenuOpen(false)}
              role="menuitem"
              tabIndex={menuOpen ? 0 : -1}
            >
              {(navItem as NavItem).label}
            </Link>
          </li>
        ))}

        {user ? (
          <>
            {user.role === 'admin' && (
              <li role="none">
                <Link
                  href="/admin"
                  className={styles.adminBtn}
                  role="menuitem"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => setMenuOpen(false)}
                >
                  <FaUserShield aria-hidden="true" />
                  <span className={styles.userLabel}>Admin</span>
                </Link>
              </li>
            )}
            <li className={styles.userMenu} role="none">
              <button
                className={styles.btnNav}
                onClick={() => setConfirmLogout(true)}
                role="menuitem"
                tabIndex={menuOpen ? 0 : -1}
                type="button"
              >
                <FiUser aria-hidden="true" />
                <span className={styles.userLabel}>Déconnexion</span>
              </button>
            </li>
          </>
        ) : (
          <>
            <li role="none">
              <Link
                href="/login"
                className={styles.btnNav}
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
                className={styles.register}
                role="menuitem"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                S&apos;inscrire
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
