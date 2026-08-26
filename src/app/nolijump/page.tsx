"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaRulerCombined, FaUsers, FaSocks } from "react-icons/fa";
import { MdNoFood } from "react-icons/md";

import content from "@/data/texts.json";
import Formule from "@/components/Formule";
import Footer from "@/components/Footer";
import GridGallery from "@/components/GridGallery";
import { ScheduleTable } from "@/components/ScheduleTable";

const imageCount = 27;
const images = Array.from({ length: imageCount }, (_, i) => ({
  original: `/images/nolijump/nolijump-${i + 1}.jpeg`,
  originalAlt: `Espace trampoline Nolijump — photo ${i + 1}`,
}));

const icons: Record<string, React.ComponentType> = {
  FaRulerCombined,
  FaUsers,
  FaSocks,
  MdNoFood,
};

export default function Nolijump() {
  const [parkStatus, setParkStatus] = useState<"open" | "closed" | "maintenance">("open");
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

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

        <h1 id="nolijump-title">Le premier trampoline park de Guadeloupe</h1>

        <p className="sub">
          Viens bondir, t&apos;éclater et te défouler sur plus de 650 m² de
          trampolines, en toute sécurité.
        </p>

        <div className="hero-actions">
          <a href="#tarifs" className="btn-primary">
            Voir les tarifs
          </a>
          <a href="#horaires" className="btn-outline">
            Voir les horaires
          </a>
        </div>
      </section>

      {/* ---- Bandeau infos pratiques ---- */}
      <section className="nolijump-info" aria-label="Informations pratiques">
        <div className="nolijump-info-grid">
          {content.informations_nolijump.items.map((item, index) => {
            const Icon = icons[item.icon];
            return (
              <div
                key={index}
                className="nolijump-info-item"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="icon-circle">
                  {Icon && <Icon aria-hidden="true" />}
                </div>
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- Activités ---- */}
      <div className="feature-container" id="activites">
        {content.features_nolijump.map((feature, i) => (
          <section
            className="feature-card"
            key={i}
            data-aos="fade-up"
            data-aos-delay={i * 100}
          >
            {feature?.image && (
              <div className="feature-image">
                <Image
                  className="rounded"
                  width={1269}
                  alt={feature?.alt ?? "Nolijump"}
                  height={906}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={feature.image}
                />
              </div>
            )}
            <div className="feature-content">
              <h2>{feature?.title}</h2>
              <p>{feature?.paragraph}</p>

              {feature?.link?.href && feature?.link?.label && (
                <Link href={feature.link.href} className="btn-secondary">
                  {feature.link.label}
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* ---- Galerie ---- */}
      <GridGallery images={images} title="La galerie Nolijump" />

      {/* ---- Horaires ---- */}
      <section id="horaires" className="nolijump-block" aria-labelledby="horaires-title">
        <h2 id="horaires-title" className="section-heading" data-aos="fade-up">
          Horaires d&apos;ouverture
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <ScheduleTable
                key={schedule.id}
                title={schedule.season}
                headers={schedule.headers}
                parkStatus={parkStatus}
                data={schedule.rows}
              />
            ))
          ) : (
            <>
              <ScheduleTable
                title="Vacances scolaires"
                headers={["3-6 ans", "à partir de 7 ans"]}
                parkStatus={parkStatus}
                data={[
                  ["Lun.", "Fermé", "Fermé"],
                  ["Mar.", "10h-12h", "12h-18h"],
                  ["Mer.", "10h-12h", "12h-18h"],
                  ["Jeu.", "10h-12h", "12h-18h"],
                  ["Ven.", "10h-12h", "12h-18h"],
                  ["Sam.", "10h-12h", "12h-18h"],
                  ["Dim.", "Fermé", "13h-17h"],
                ]}
              />

              <ScheduleTable
                title="Périodes scolaires"
                headers={["3-6 ans", "à partir de 7 ans"]}
                parkStatus={parkStatus}
                data={[
                  ["Lun.", "Fermé", "Fermé"],
                  ["Mar.", "Fermé", "Fermé"],
                  ["Mer.", "10h-12h", "12h-17h"],
                  ["Jeu.", "Fermé", "Fermé"],
                  ["Ven.", "Fermé", "Fermé"],
                  ["Sam.", "10h-12h", "12h-18h"],
                  ["Dim.", "Fermé", "13h-17h"],
                ]}
              />
            </>
          )}
        </div>
      </section>

      {/* ---- Tarifs ---- */}
      <section id="tarifs" className="nolijump-block" aria-labelledby="tarifs-title">
        <h2 id="tarifs-title" className="section-heading" data-aos="fade-up">
          Tarifs
        </h2>

        <div className="formule-grid">
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
              { time: "Enfant : ", price: "4,00€" },
              { time: "Adulte : ", price: "8,99€" },
            ]}
            showIcons={false}
            highlightPrice
            showButton={false}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
