"use client";

import Link from "next/link";
import Image from "next/image";
import content from "../../public/texts.json";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="cta" data-aos="fade-up">
      {/* Bloc principal en deux colonnes */}
      <div className="footer-wrapper">
        {/* Colonne gauche : tout le contenu texte */}
        <div className="footer-left">
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

            {/* Liens légaux */}
            <div className="footer-links">
              <ul>
                <li>
                  <Link href="/legal#ml">Mentions légales</Link>
                </li>
                <li>
                  <Link href="/legal#cgu">Conditions Générales d'Utilisation</Link>
                </li>
                <li>
                  <Link href="/legal#pdc">Politique de confidentialité</Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Colonne droite : logos */}
        <div className="footer-logos">
          <Image
            src={content.header["image-noliparc"]}
            alt="Logo Noliparc"
           width={317}
height={226}
          />
          <Image
            src={content.header["image-nolijump-texte"]}
            alt="Logo Nolijump"
              width={317}
height={226}
          />
        </div>
      </div>

       <div className="footer-bottom">
              <p>
                &copy; {new Date().getFullYear()} Site conçu par Noliparc. Tous droits réservés.
              </p>
              <p>Téléphone : 0690759848 | Mail : contact@noliparc.com</p>
            </div>
    </footer>
  );
}
