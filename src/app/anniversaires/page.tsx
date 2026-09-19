"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Formule from "../../components/Formule";
import content from "@/data/texts.json";
import formule from "@/data/formule.json";

function buildQuery(pack: { title: string }) {
  if (!pack.title) return "";

  return new URLSearchParams({
    formule: encodeURIComponent(
      pack.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Supprime accents
        .replace(/[()]/g, "") // Supprime parenthèses
        .replace(/[’']/g, "") // Supprime apostrophes
        .replace(/\s+/g, "-") // Remplace espaces par tirets
        .replace(/[^a-z0-9-]/g, "") // Supprime caractères indésirables
    ),
  }).toString();
}

const noliparcPackages = formule.noliparcPackages;
const nolijumpPackages = formule.nolijumpPackages;

const goldenPack = nolijumpPackages.find((p) =>
  p.title.toLowerCase().includes("golden")
);
const nolijumpPackagesSansGolden = nolijumpPackages.filter(
  (p) => !p.title.toLowerCase().includes("golden")
);

export default function AnniversairesPage() {
  return (
    <>
      <header className="page-hero page-hero--anniv">
        <span className="hero-eyebrow">🎉 Fête ton anniversaire chez nous</span>
        <h1>Organise ton anniversaire 🎉</h1>
        <p>
          Pour nos formules, l&apos;heure indiquée concerne la salle
          d&apos;anniversaire. Le parc est accessible après !
        </p>
      </header>

      <div className="page-content page-content--anniv">
        {/* ---- Formules Noliparc ---- */}
        <section aria-labelledby="formules-noliparc">
          <h2 id="formules-noliparc" className="section-title">
            <img
              alt="Formules Noliparc"
              className="image-texte"
              src={content.header["image-nolitexte"]}
            />
          </h2>
          <div className="packages packages-3">
            {noliparcPackages.map((pack) => (
              <Formule
                key={pack.title}
                title={pack.title}
                subtitle={pack.subtitle}
                durations={pack.durations}
                notes={pack.notes}
                details={pack.details}
                variant="noliparc-anniv"
              />
            ))}
          </div>
        </section>

        {/* ---- Formules Nolijump ---- */}
        <section aria-labelledby="formules-nolijump">
          <h2 id="formules-nolijump" className="section-title">
            <img
              alt="Formules Nolijump"
              className="image-texte"
              src={content.header["image-nolijump-texte"]}
            />
          </h2>
          <div className="packages packages-3">
            {nolijumpPackagesSansGolden.map((pack) => (
              <Formule
                key={pack.title}
                title={pack.title}
                subtitle={pack.subtitle}
                age={pack.age}
                durations={pack.durations}
                notes={pack.notes}
                details={pack.details}
                variant="nolijump-anniv"
              />
            ))}
          </div>
        </section>

        {/* ---- Golden Birthday (pleine largeur) ---- */}
        {goldenPack && (
          <section className="golden-hero" aria-labelledby="golden-title">
            <Image
              src="/images/nolijump/nolijump-1.jpeg"
              alt=""
              fill
              priority={false}
              sizes="100vw"
              className="golden-hero__img"
            />
            <div className="golden-hero__overlay" aria-hidden="true" />
            <div className="golden-hero__content">
              <h2 id="golden-title">GOLDEN Birthday</h2>
              <p className="golden-hero__sub">
                La formule la plus complète : privatisation du trampoline park le
                dimanche, pour une fête inoubliable.
              </p>
              <ul className="golden-hero__perks">
                {goldenPack.notes?.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
              <p className="golden-hero__price">
                {goldenPack.durations?.[0]?.price ?? ""}
              </p>
              <Link
                href={`/anniversaires/reserver?${buildQuery(goldenPack)}`}
                className="golden-hero__cta"
              >
                Réserver le Golden Birthday
              </Link>
            </div>
          </section>
        )}

        <p className="notice">
          ⚠️ Un acompte de 50% est requis pour réserver. Remboursable selon nos{" "}
          <Link href="/legal#annulation">
            conditions d&apos;annulation et de remboursement
          </Link>
          .
          <br />
          🚫 Boissons et aliments extérieurs interdits.
          <br />
          🧦 Chaussettes anti-dérapantes obligatoires pour l&apos;espace
          trampoline.
        </p>
      </div>
    </>
  );
}
