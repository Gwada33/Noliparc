"use client";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import content from "../../../public/texts.json";
import Formule from "@/components/Formule";

const imageCount = 27; // ou le nombre exact d'images
const images = Array.from({ length: imageCount }, (_, i) => ({
  original: `/images/nolijump/nolijump-${i + 1}.jpeg`,
  originalAlt: `nolijump-${i + 1}.jpeg`,
}));

import {
  FaClock,
  FaRulerCombined,
  FaUsers,
  FaSocks,
  FaGavel,
} from "react-icons/fa";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import GridGallery from "@/components/GridGallery";
import { ScheduleTable } from "@/components/ScheduleTable";
import { Box, Typography } from "@mui/material";
import { MdNoFood } from "react-icons/md";

const icons: any = {
  FaRulerCombined: FaRulerCombined,
  FaUsers: FaUsers,
  FaSocks: FaSocks,
  MdNoFood: MdNoFood,
  FaClock: FaClock,
  FaGavel: FaGavel,
};



export default function Nolijump() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  return (
    <main>
      <section id="nolijump" className="nolijump-section">
        <div className="nolijump-container">
          <Image
            alt="image-nolijump"
            className="image-nolijump"
            width={1000}
            height={1000}
            src={content.header["image-nolijump"]}
          />
          <h2 className="nolijump-title" data-aos="fade-up"></h2>
          <p
            className="nolijump-description"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Viens sauter, courir et t'amuser dans notre espace trampoline unique
            en Guadeloupe ! Adapté à tous les âges, Nolijump te propose des
            formules variées pour tous les niveaux d’énergie 🎉
          </p>

          <GridGallery
            images={images}
            background={false}
            title="Un grand espace pour vos enfants"
          />

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
            justifyContent="center"
            alignItems="flex-start"
            mt={10}
            mb={10}
          >
            <ScheduleTable
              title="Vacances scolaires"
              headers={["3-6 ans", "à partir de 7 ans"]}
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
              data={[
                ["Lun.", "Fermé", "Fermé"],
                ["Mar.", "Fermé", "Fermé"],
                ["Mer.", "10h-12h", "12h-18h"],
                ["Jeu.", "Fermé", "Fermé"],
                ["Ven.", "Fermé", "Fermé"],
                ["Sam.", "10h-12h", "12h-18h"],
                ["Dim.", "Fermé", "13h-17h"],
              ]}
            />
          </Box>

          <div className="feature-container" id="noliparc">
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
                      alt={feature?.alt ?? "Noliparc.fr"}
                      height={906}
                      src={feature.image}
                    />
                  </div>
                )}
                <div className="feature-content">
                  <h2>{feature?.title}</h2>
                  <Typography
                    sx={{
                      whiteSpace: "pre-line",
                      whiteSpaceTrim: "discard-after",
                    }}
                  >
                    <p>{feature?.paragraph}</p>
                  </Typography>

                  {feature?.link?.href && feature?.link?.label && (
                    <Link href={feature.link.href} className="btn-secondary">
                      {feature.link.label}
                    </Link>
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="jump-pricing" data-aos="fade-up" data-aos-delay="300">
            <h3 className="formule-title">Tarifs</h3>

            <div className="formule-grid">
              <Formule
                title="Mini Jump 1h"
                variant="nolijump-entree"
                subtitle="(3-6 ans, 10h-12h)"
                durations={[{ time: "", price: "10€" }]}
                showIcons={false}
                highlightPrice={true}
                showButton={false}
              />

              <Formule
                title="Fun Jump"
                subtitle="(7 ans et +)"
                variant="nolijump-entree"
                durations={[
                  { time: "1h : ", price: "13€" },
                  { time: "1h30 : ", price: "17€" },
                ]}
                showIcons={false}
                highlightPrice={true}
                showButton={false}
              />

              <Formule
                title="Crazy Jump 2h"
                subtitle="(7 ans et +)"
                variant="nolijump-entree"
                durations={[{ time: "", price: "23€" }]}
                showIcons={false}
                highlightPrice={true}
                showButton={false}
              />

              <Formule
                title="Offre Étudiant"
                variant="nolijump-entree"
                subtitle="(à partir de 12h)"
                durations={[
                  { time: "1h (Hors vacance scolaire) : ", price: "10.50€" },
                  { time: "1h (pendant les vacances) : ", price: "8€" },
                ]}
                notes={["(Justificatif demandé)"]}
                showIcons={false}
                highlightPrice={true}
                showButton={false}
              />

              <Formule
                title="Pass 10 entrées"
                subtitle="(Valable pour la prochaine visite)"
                variant="nolijump-entree"
                durations={[{ time: "", price: "110€" }]}
                showIcons={false}
                highlightPrice={true}
                showButton={false}
              />

              <Formule
                title="Chaussetes anti-dérapantes"
                variant="nolijump-entree"
                durations={[{ time: "", price: "2€" }]}
                showIcons={false}
                highlightPrice={true}
                showButton={false}
              />
            </div>
          </div>
          {/*<div className="nolijump-btn" data-aos="zoom-in" data-aos-delay="400">
            <Link href="/reservation" className="btn-primary">
              Réserver une session
            </Link>
          </div>*/}
        </div>
      </section>

      <section className="informations-section">
        <ul className="informations-list">
          {content.informations_nolijump.items.map((item, index) => {
            const Icon = icons[item.icon];
            return (
              <li key={index} className="informations-item">
                {Icon && <Icon />}
                {item.text}
              </li>
            );
          })}
        </ul>
      </section>

      <Footer />
    </main>
  );
}
