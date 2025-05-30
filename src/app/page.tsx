"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import content from "../../public/texts.json";
import {
  FaRulerCombined,
  FaUsers,
  FaClock,
  FaGavel,
  FaSocks,
} from "react-icons/fa";
import { MdNoFood } from "react-icons/md";
import { Box, Typography } from "@mui/material";
import HeroCarousel from "@/components/HeroCarrousel";
import Footer from "@/components/Footer";
import { ScheduleTable } from "@/components/ScheduleTable";
import Formule from "@/components/Formule";

const icons: any = {
  FaRulerCombined: FaRulerCombined,
  FaUsers: FaUsers,
  FaSocks: FaSocks,
  MdNoFood: MdNoFood,
  FaClock: FaClock,
  FaGavel: FaGavel,
};

export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <>
      <main className="home">
        <HeroCarousel />
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
            headers={["Jusqu'à 10 ans"]}
            data={[
              ["Lun.", "Fermé"],
              ["Mar.", "10h-18h"],
              ["Mer.", "10h-18h"],
              ["Jeu.", "10h-18h"],
              ["Ven.", "10h-18h"],
              ["Sam.", "10h-18h"],
              ["Dim.", "Fermé"],
            ]}
          />

          <ScheduleTable
            title="Périodes scolaires"
            headers={["Jusqu'à 10 ans"]}
            data={[
              ["Lun.", "Fermé"],
              ["Mar.", "Fermé"],
              ["Mer.", "10h-18h"],
              ["Jeu.", "Fermé"],
              ["Ven.", "Fermé"],
              ["Sam.", "10h-18h"],
              ["Dim.", "Fermé"],
            ]}
          />
        </Box>

        <div className="feature-container" id="noliparc">
          {content.features.map((feature, i) => (
            <section
              className="feature-card"
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              {feature.image && (
                <div className="feature-image">
                  <Image
                    className="rounded"
                    width={1269}
                    alt={feature.alt ?? "Noliparc.fr"}
                    height={906}
                    src={feature.image}
                  />
                </div>
              )}
              <div className="feature-content">
                <h2>{feature.title}</h2>
                <Typography
                  sx={{
                    whiteSpace: "pre-line",
                    whiteSpaceTrim: "discard-after",
                  }}
                >
                  <p>{feature.paragraph}</p>
                </Typography>
                <Link href={feature.link.href} className="btn-secondary">
                  {feature.link.label}
                </Link>
              </div>
            </section>
          ))}
        </div>
        <section className="informations-section">
          <ul className="informations-list">
            {content.informations_noliparc.items.map((item, index) => {
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

        <div className="jump-pricing" data-aos="fade-up" data-aos-delay="300">
          <h3 className="formule-title">Tarifs</h3>
          <section className="tarifs-section">
            <div className="tarif-item">
              <span className="tarif-label">Moins de 1 an</span>
              <span className="tarif-value">Gratuit</span>
            </div>

            <div className="tarif-item">
              <span className="tarif-label">De 1 à 10 ans</span>
              <span className="tarif-value">12€</span>
            </div>

            <div className="tarif-item">
              <span className="tarif-label">Adulte</span>
              <span className="tarif-value">
                <span className="tarif-sub">
                  1 adulte accompagnateur gratuit
                </span>
                <span className="tarif-sub">5€ par adulte supplémentaire</span>
              </span>
            </div>

            <div className="tarif-item">
              <span className="tarif-label">Chaussettes</span>
              <span className="tarif-value">
                <span className="tarif-sub">Adulte : 3€</span>
                <span className="tarif-sub">Enfant : 2.50€</span>
              </span>
            </div>
          </section>

          <div className="formule-grid">
            <Formule
              title="Pass 4 entrées "
              variant="noliparc-anniv"
              subtitle=""
              durations={[{ time: "", price: "36€" }]}
              showIcons={false}
              highlightPrice={true}
              showButton={false}
            />

            <Formule
              title="Pass 7 entrées "
              variant="noliparc-anniv"
              subtitle=""
              durations={[{ time: "", price: "60€" }]}
              showIcons={false}
              highlightPrice={true}
              showButton={false}
            />
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
