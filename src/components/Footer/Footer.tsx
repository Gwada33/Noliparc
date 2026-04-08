"use client";

import Link from "next/link";
import Image from "next/image";
import content from "@/data/texts.json";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} data-aos="fade-up">
      <div className={styles.footerWrapper}>
        {/* Left column: text content */}
        <div className={styles.footerLeft}>
          <div className={styles.footerContent}>
            <h2>{content.footer.title}</h2>

            {/* Social links */}
            <div className={styles.footerSocials}>
              <h4 className={styles.footerSocialsTitle}>Suivez-nous</h4>
              <div className={styles.footerSocialsIcons}>
                <a
                  href="https://www.facebook.com/noliparc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerIconLink}
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://www.instagram.com/noliparc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerIconLink}
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.tiktok.com/@noliparc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerIconLink}
                  aria-label="TikTok"
                >
                  <FaTiktok />
                </a>
              </div>
            </div>

            {/* Legal links */}
            <div className={styles.footerLinks}>
              <ul>
                <li>
                  <Link href="/legal#ml">Mentions légales</Link>
                </li>
                <li>
                  <Link href="/legal#cgu">Conditions Générales d&apos;Utilisation</Link>
                </li>
                <li>
                  <Link href="/legal#pdc">Politique de confidentialité</Link>
                </li>
                <li>
                  <a 
                    href="https://ewyyikh0ws.ufs.sh/f/dpcit5LWLcSxdMZ5nqLWLcSxqA9Ruy1jCf5svknpPhI6MVN7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Décharge de responsabilité et autorisation parentale
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right column: logos */}
        <div className={styles.footerLogos}>
          <Image
            src={content.header["image-noliparc"]}
            alt="Logo Noliparc"
            width={250}
            height={180}
          />
          <Image
            src={content.header["image-nolijump-texte"]}
            alt="Logo Nolijump"
            width={250}
            height={180}
          />
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} Site conçu par Noliparc. Tous droits réservés.
        </p>
        <p>
          Téléphone : <a href="tel:0690759848">0690759848</a> | 
          Mail : <a href="mailto:contact@noliparc.com">contact@noliparc.com</a>
        </p>
      </div>
    </footer>
  );
}
