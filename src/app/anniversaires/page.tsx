"use client";

import React from "react";
import Formule from "../../components/Formule";
import content from "@/data/texts.json";
import formule from "@/data/formule.json";
import Link from "next/link";

function buildQuery(pack: { title: string }) {
  if (!pack.title) return "";

  return new URLSearchParams({
    formule: encodeURIComponent(
      pack.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Supprime accents
        .replace(/[()]/g, "")            // Supprime parenthèses
        .replace(/[’']/g, "")            // Supprime apostrophes
        .replace(/\s+/g, "-")            // Remplace espaces par tirets
        .replace(/[^a-z0-9-]/g, "")      // Supprime caractères indésirables
    ),
  }).toString();
}


const noliparcPackages = formule.noliparcPackages
const nolijumpPackages = formule.nolijumpPackages
export default function AnniversairesPage() {
  return (
    <div className="page">
      <h1>Organise ton Anniversaire 🎉</h1>
      <p className="intro">
        Pour nos formules, l'heure indiquée concerne la salle d'anniversaire. Le parc est
        accessible après !
      </p>
      <section>
        <h2 className="section-title">
          <img
            alt="Formules Noli Parc"
            className="image-texte"
            src={content.header["image-nolitexte"]}
          />
        </h2>
        <div className="packages-3 packages">
          {noliparcPackages.map((pack) => (
            <Formule
              key={pack.title}
              title={pack.title}
              subtitle={pack.subtitle}
              durations={pack.durations}
              notes={pack.notes}
              details={pack.details}
              variant="noliparc-anniv"
            >
              <Link
                 href={`/anniversaires/reserver?${buildQuery(pack)}`}
                className="btn"
              >
                Envoyer ma demande
              </Link>
            </Formule>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">
          <img
            alt="Formules Noli Jump"
            className="image-texte"
            src={content.header["image-nolijump-texte"]}
          />
        </h2>
        <div className="packages packages-3">
          {nolijumpPackages.map((pack) => (
            <Formule
              key={pack.title}
              title={pack.title}
              subtitle={pack.subtitle}
              age={pack.age}
              durations={pack.durations}
              notes={pack.notes}
              details={pack.details}
              variant="nolijump-anniv"
            >
              <Link
                href={`/anniversaires/reserver?${buildQuery(pack)}`}
                className="btn"
              >
                Envoyer ma demande
              </Link>
            </Formule>
          ))}
          
        </div>
      </section>

      <p className="notice">
        ⚠️ Un acompte de 50% est requis pour réserver. Non remboursable en cas d'annulation,
        mais échangeable contre un report ou des entrées. <br />
        🚫 Boissons et aliments extérieurs interdits.<br />
        🧦 Chaussettes anti-dérapantes obligatoires pour l'espace trampoline.
      </p>
    </div>
  );
}
