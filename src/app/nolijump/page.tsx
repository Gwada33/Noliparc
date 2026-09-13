"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSocks } from "react-icons/fa";

import content from "@/data/texts.json";
import Formule from "@/components/Formule";
import Footer from "@/components/Footer";
import ScheduleCard from "@/components/ScheduleCard";

const imageCount = 27;
const images = Array.from({ length: imageCount }, (_, i) => ({
  original: `/images/nolijump/nolijump-${i + 1}.jpeg`,
  originalAlt: `Espace trampoline Nolijump — photo ${i + 1}`,
}));

const DAY_NAMES = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];

const VACANCES = [
  ["Lun.", "Fermé", "Fermé"],
  ["Mar.", "10h-12h", "12h-18h"],
  ["Mer.", "10h-12h", "12h-18h"],
  ["Jeu.", "10h-12h", "12h-18h"],
  ["Ven.", "10h-12h", "12h-18h"],
  ["Sam.", "10h-12h", "12h-18h"],
  ["Dim.", "Fermé", "13h-17h"],
];

const SCOLAIRE = [
  ["Lun.", "Fermé", "Fermé"],
  ["Mar.", "Fermé", "Fermé"],
  ["Mer.", "10h-12h", "12h-17h"],
  ["Jeu.", "Fermé", "Fermé"],
  ["Ven.", "Fermé", "Fermé"],
  ["Sam.", "10h-12h", "12h-18h"],
  ["Dim.", "Fermé", "13h-17h"],
];
/* Galerie : grille légère (8 photos) + extension + plein écran */
function NolijumpGallery() {
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const visible = showAll ? images : images.slice(0, 8);

  return (
    <>
      <h3 className="block-title" data-aos="fade-up">
        En images
      </h3>
      <div className="noli-gallery-grid">
        {visible.map((img, i) => (
          <button
            key={img.original}
            type="button"
            className="noli-gallery-item"
            onClick={() => setLightbox(img.original)}
            aria-label={`Agrandir la photo ${i + 1}`}
          >
            <Image
              src={img.original}
              alt={img.originalAlt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </button>
        ))}
      </div>
      <div className="noli-gallery-actions">
        <button
          type="button"
          className="btn-outline"
          onClick={() => setShowAll((s) => !s)}
        >
          {showAll ? "Réduire la galerie" : `Voir les ${images.length} photos`}
        </button>
      </div>
      {lightbox && (
        <div className="fullscreen-modal" onClick={() => setLightbox(null)}>
          <div className="fullscreen-image-container">
            <Image src={lightbox} alt="" fill className="fullscreen-image" />
            <button
              className="fullscreen-close-btn"
              onClick={() => setLightbox(null)}
              aria-label="Fermer l'image"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function Nolijump() {
  const [parkStatus, setParkStatus] = useState<"open" | "closed" | "maintenance">("open");
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.parkStatus) setParkStatus(data.parkStatus);
      })
      .catch(console.error);

    fetch("/api/schedules?location=Nolijump")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setSchedules(data);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="page-nolijump">
      {/* ---- Hero ---- */}
      <section className="nolijump-hero" aria-labelledby="nolijump-title">
        <Image
          src={content.header["image-nolijump"]}
          alt="Nolijump — parc de trampolines"
          width={1000}
          height={600}
          priority
          className="nolijump-logo"
        />

        <h1 id="nolijump-title">Le trampoline park de Guadeloupe</h1>

        <p className="sub">
          Sautille, voltige et défie tes amis sur 650 m² de trampolines indoor.
        </p>

        <div className="hero-actions">
          <a href="#horaires-tarifs" className="btn-primary">
            Voir les tarifs
          </a>
          <a href="#decouvrir" className="btn-outline">
            Découvrir
          </a>
        </div>

        <div className="socks-alert" role="note">
          <FaSocks className="socks-alert__icon" aria-hidden="true" />
          <div>
            <p className="socks-alert__title">
              Chaussettes anti-dérapantes obligatoires
            </p>
            <p className="socks-alert__text">
              L&apos;accès aux trampolines exige des chaussettes antidérapantes.
              Achetez-les sur place : 5 € (enfant) · 8,99 € (adulte).
            </p>
          </div>
        </div>
      </section>

      {/* ---- Horaires & tarifs ---- */}
      <section
        id="horaires-tarifs"
        className="nolijump-block"
        aria-labelledby="horaires-tarifs-title"
      >
        <h2 id="horaires-tarifs-title" className="section-heading" data-aos="fade-up">
          Horaires &amp; tarifs
        </h2>

        {parkStatus === "closed" && (
          <p className="sched-closed-alert">
            ⚠️ Le parc est exceptionnellement fermé en ce moment.
          </p>
        )}

        <div className="sched-grid" data-aos="fade-up">
          {schedules.length > 0 ? (
            schedules.map((s) => (
              <ScheduleCard
                key={s.id}
                tone="orange"
                title={String(s.season || "Horaires")}
                headers={s.headers || ["3-6 ans", "7 ans et +"]}
                data={s.rows}
              />
            ))
          ) : (
            <>
              <ScheduleCard
                tone="orange"
                title="Pendant les vacances"
                headers={["3-6 ans", "7 ans et +"]}
                data={VACANCES}
              />
              <ScheduleCard
                tone="orange"
                title="Périodes scolaires"
                headers={["3-6 ans", "7 ans et +"]}
                data={SCOLAIRE}
              />
            </>
          )}
        </div>

        <h3 id="tarifs" className="block-title" data-aos="fade-up">
          Tarifs
        </h3>

        <div className="formule-grid" data-aos="fade-up">
          <Formule
            title="Mini Jump 1h"
            variant="nolijump-entree"
            subtitle="(3-6 ans, 10h-12h)"
            durations={[{ time: "", price: "10€" }]}
            showIcons={false}
            highlightPrice
            showButton={false}
          />
          <Formule
            title="Fun Jump"
            subtitle="(7 ans et +, 12-18h)"
            variant="nolijump-entree"
            durations={[
              { time: "1h : ", price: "13€" },
              { time: "1h30 : ", price: "17€" },
            ]}
            showIcons={false}
            highlightPrice
            showButton={false}
          />
          <Formule
            title="Crazy Jump 2h"
            subtitle="(7 ans et +, 12-18h)"
            variant="nolijump-entree"
            durations={[{ time: "", price: "23€" }]}
            showIcons={false}
            highlightPrice
            showButton={false}
          />
          <Formule
            title="Offre Étudiant"
            variant="nolijump-entree"
            subtitle="(à partir de 12h)"
            durations={[{ time: "1h : ", price: "10.50€" }]}
            notes={["(Justificatif demandé)"]}
            showIcons={false}
            highlightPrice
            showButton={false}
          />
          <Formule
            title="Pass 10 entrées"
            subtitle="(Valable pour la prochaine visite)"
            variant="nolijump-entree"
            durations={[{ time: "", price: "110€" }]}
            showIcons={false}
            highlightPrice
            showButton={false}
          />
          <Formule
            title="Chaussettes anti-dérapantes"
            variant="nolijump-entree"
            durations={[
              { time: "Enfant : ", price: "5€" },
              { time: "Adulte : ", price: "8,99€" },
            ]}
            showIcons={false}
            highlightPrice
            showButton={false}
          />
        </div>
      </section>

      {/* ---- Découvrir ---- */}
      <section
        id="decouvrir"
        className="nolijump-block"
        aria-labelledby="decouvrir-title"
      >
        <h2 id="decouvrir-title" className="section-heading" data-aos="fade-up">
          Découvrir Nolijump
        </h2>

        <div className="offers-grid">
          <article className="offer-card">
            <div className="offer-card__img">
              <Image
                src="/images/saut-nolijump.jpeg"
                alt="Trampolines Nolijump"
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
              />
            </div>
            <div className="offer-card__body">
              <h3 className="offer-card__title">Les trampolines</h3>
              <ul className="offer-card__points">
                <li>650 m² de trampolines indoor</li>
                <li>Basket aérien &amp; dodgeball</li>
                <li>Pour les enfants à partir de 3 ans</li>
              </ul>
              <a href="#tarifs" className="offer-card__cta btn-primary">
                Voir les tarifs
              </a>
            </div>
          </article>

          <article className="offer-card">
            <div className="offer-card__img">
              <Image
                src="/images/nolijump/nolijump-24.jpeg"
                alt="Anniversaire à Nolijump"
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
              />
            </div>
            <div className="offer-card__body">
              <h3 className="offer-card__title">Les anniversaires</h3>
              <ul className="offer-card__points">
                <li>Formules dès 18 € / enfant</li>
                <li>Animation trampoline encadrée</li>
                <li>Goûter &amp; gâteau inclus</li>
              </ul>
              <Link href="/anniversaires" className="offer-card__cta btn-primary">
                Organiser un anniversaire
              </Link>
            </div>
          </article>

          <article className="offer-card">
            <div className="offer-card__img offer-card__img--contain">
              <Image
                src="/images/snack.png"
                alt="Le snack Nolijump"
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
              />
            </div>
            <div className="offer-card__body">
              <h3 className="offer-card__title">Le snack</h3>
              <ul className="offer-card__points">
                <li>Hamburgers &amp; frites croustillantes</li>
                <li>Granitas &amp; boissons fraîches</li>
                <li>Pause gourmande sur place</li>
              </ul>
              <Link href="/snack" className="offer-card__cta btn-primary">
                Voir la carte
              </Link>
            </div>
          </article>
        </div>

        <NolijumpGallery />
      </section>

      <Footer />
    </main>
  );
}