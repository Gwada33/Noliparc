import Link from "next/link"
import content from "../../public/texts.json";

export default function Footer(){
    return(
         <footer className="cta" data-aos="fade-up">
          <div className="footer-content">
            <h2>{content.footer.title}</h2>
            <p>{content.footer.description}</p>
            <Link href="/newsletter" className="btn-secondary">
              {content.footer.cta}
            </Link>
          </div>

          <div className="footer-links">
            <ul>
              <li>
                <Link href="/legal#ml">Mentions légales</Link>
              </li>
              <li>
                <Link href="/legal#cgu">Conditions Générales d'Utilisation</Link>
              </li>
              <li>
                <Link href="/legal#pdc">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/accessibilite">Accessibilité</Link>
              </li>
            </ul>
          </div>

          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} Noliparc — Site conçu par Sund Productions. Tous droits réservés.

            </p>
          </div>
        </footer>
    )
}