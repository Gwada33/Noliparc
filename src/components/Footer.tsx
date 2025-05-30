"use client";

import Link from "next/link";
import content from "../../public/texts.json";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="cta" data-aos="fade-up">
      <div className="footer-content">
        <h2>{content.footer.title}</h2>
            {/* Réseaux sociaux */}
        <div className="footer-socials">
        <h4 className="footer-socials-title">Suivez-nous</h4>
        <div className="footer-socials-icons">
          <a
            href="https://www.facebook.com/noliparc/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-icon-link"
          >
            <FaFacebookF size={30} />
          </a>
          <a
            href="https://www.instagram.com/noliparc/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-icon-link"
          >
            <FaInstagram size={30} />
          </a>
          <a
            href="https://www.tiktok.com/@noliparc"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-icon-link"
          >
            <FaTiktok size={30} />
          </a>
        </div>
      </div>
      </div>


      <div className="footer-links">
        <ul>
          <li><Link href="/legal#ml">Mentions légales</Link></li>
          <li><Link href="/legal#cgu">Conditions Générales d'Utilisation</Link></li>
          <li><Link href="/legal#pdc">Politique de confidentialité</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Noliparc — Site conçu par Sund Productions. Tous droits réservés.
        </p>

        <p> Téléphone : 0690759848 </p>
      </div>
    </footer>
  );
}
