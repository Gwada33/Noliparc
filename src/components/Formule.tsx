import React, { ReactNode } from "react";
import Link from "next/link";
import { FaEuroSign, FaChild, FaClipboardList } from "react-icons/fa";
import { BsDot } from "react-icons/bs";

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
  variant?: "noliparc-anniv" | "nolijump-anniv" | "nolijump-entree";
  showIcons?: boolean;
  highlightPrice?: boolean;
  children?: ReactNode;  // <-- ici on ajoute children
}


const Formule: React.FC<FormuleCardProps> = ({
  title,
  subtitle,
  durations,
  notes,
  details,
  age,
  variant = "noliparc-anniv",
  showIcons = true,
  highlightPrice = false,
}) => {
  const queryParams = new URLSearchParams({
    formule: title.toLowerCase().replace(/\s+/g, '-'),
  }).toString();

  return (
    <div className={`formule-card ${variant}`}>
      <h4>{title}</h4>

      {subtitle && <p className="subtitle">{subtitle}</p>}

      {age && (
        <p className="age">
          {showIcons && <FaChild className="icon age-icon" />} {age}
        </p>
      )}

      <ul>
        {durations.map((d, i) => (
          <li key={i}>
            {showIcons && <FaEuroSign className="icon list-icon" />}
            <span className="time">{d.time}</span>
            <b className={`price ${highlightPrice ? "highlight" : ""}`}>
              {d.price}
            </b>
          </li>
        ))}
      </ul>

      {details && details.length > 0 && (
        <div className="details">
          {details.map((detail, i) => (
            <p key={i}>
              {showIcons && <FaClipboardList className="icon detail-icon" />} {detail}
            </p>
          ))}
        </div>
      )}

      {notes &&
        notes.length > 0 &&
        notes.map((note, i) => (
          <small className="note" key={i}>
            {showIcons && <BsDot className="icon note-icon" />} {note}
          </small>
        ))}

      <Link className="btn-reserver" href={`/anniversaires/reserver?${queryParams}`}>
        Envoyer ma demande
      </Link>
    </div>
  );
};

export default Formule;
