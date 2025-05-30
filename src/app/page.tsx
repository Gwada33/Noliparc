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
  FaSocks
} from "react-icons/fa";
import { MdNoFood } from 'react-icons/md'
import {
  Box,
  Typography,
} from "@mui/material";
import HeroCarousel from "@/components/HeroCarrousel";
import Footer from "@/components/Footer";
import { ScheduleTable } from "@/components/ScheduleTable";

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
                    ["Lun.", "Fermé",],
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
                <div  className="feature-image">
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

            <Footer />
      </main>
    </>
  );
}
