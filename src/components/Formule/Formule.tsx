import React, { ReactNode } from "react";
import Link from "next/link";
import { FaEuroSign, FaChild, FaClipboardList } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import styles from "./Formule.module.css";

interface Duration {
  time: string;
  price: string;
}

interface FormuleCardProps {
  title: string;
  subtitle?: string;
  durations: Duration[];
  notes?: string[];
  details?: string[];
  age?: string;
  showButton?: boolean;
  variant?: "noliparc-anniv" | "nolijump-anniv" | "nolijump-entree";
  showIcons?: boolean;
  highlightPrice?: boolean;
  children?: ReactNode;
}

const variantMap = {
  "noliparc-anniv": styles.noliparcAnniv,
  "nolijump-anniv": styles.nolijumpAnniv,
  "nolijump-entree": styles.nolijumpEntree,
};

const Formule: React.FC<FormuleCardProps> = ({
  title,
  subtitle,
  durations,
  notes,
  details,
  age,
  showButton = true,
  variant = "noliparc-anniv",
  showIcons = true,
  highlightPrice = false,
}) => {
  const queryParams = new URLSearchParams({
    formule: title.toLowerCase().replace(/\s+/g, "-"),
  }).toString();

  const cardClasses = [styles.formuleCard, variantMap[variant] || ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      <h4 className={styles.title}>{title}</h4>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      {age && (
        <p className={styles.age}>
          {showIcons && <FaChild className={styles.ageIcon} />} {age}
        </p>
      )}

      <ul className={styles.durationList}>
        {durations.map((d, i) => (
          <li key={i} className={styles.durationItem}>
            {showIcons && <FaEuroSign className={styles.listIcon} />}
            <span className={styles.time}>{d.time}</span>
            <b
              className={`${styles.price} ${
                highlightPrice ? styles.priceHighlight : ""
              }`}
            >
              {d.price}
            </b>
          </li>
        ))}
      </ul>

      {details && details.length > 0 && (
        <div className={styles.details}>
          {details.map((detail, i) => (
            <p key={i}>
              {showIcons && <FaClipboardList className={styles.detailIcon} />}{" "}
              {detail}
            </p>
          ))}
        </div>
      )}

      {notes &&
        notes.length > 0 &&
        notes.map((note, i) => (
          <small className={styles.note} key={i}>
            {showIcons && <BsDot className={styles.noteIcon} />} {note}
          </small>
        ))}

      {showButton && (
        <Link
          className={styles.btnReserver}
          href={`/anniversaires/reserver?${queryParams}`}
        >
          Envoyer ma demande
        </Link>
      )}
    </div>
  );
};

export default Formule;
