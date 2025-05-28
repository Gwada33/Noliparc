"use client";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import content from "../../../public/texts.json";
import Formule from "@/components/Formule";
import {
  FaClock,
  FaCalendarAlt,
  FaRulerCombined,
  FaUsers,
  FaGavel,
} from "react-icons/fa";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import { ScheduleTable } from "@/components/ScheduleTable";
import { Box } from "@mui/material";

const icons: any = {
  FaRulerCombined: FaRulerCombined,
  FaUsers: FaUsers,
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
                ["Dim.", "-", "13h-17h"],
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
                ["Dim.", "-", "13h-17h"],
              ]}
            />
          </Box>

          <div className="jump-pricing" data-aos="fade-up" data-aos-delay="300">
            <h3 className="formule-title">Nos formules</h3>
            <div className="formule-grid">
              <Formule
                title="Mini Jump 1h"
                variant="nolijump-entree"
                subtitle="(2-6 ans, 10h-12h)"
                durations={[{ time: "", price: "10€" }]}
                showIcons={false}
                highlightPrice={true}
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
              />

              <Formule
                title="Crazy Jump 2h"
                subtitle="(7 ans et +)"
                variant="nolijump-entree"
                durations={[{ time: "", price: "23€" }]}
                showIcons={false}
                highlightPrice={true}
              />

              <Formule
                title="Offre Étudiant"
                variant="nolijump-entree"
                subtitle="(à partir de 12h)"
                durations={[
                  { time: "1h : ", price: "8€" },
                  { time: "2h30 : ", price: "18€" },
                ]}
                notes={["(Justificatif demandé)"]}
                showIcons={false}
                highlightPrice={true}
              />

              <Formule
                title="Carnet de 10h"
                variant="nolijump-entree"
                durations={[{ time: "", price: "110€" }]}
                showIcons={false}
                highlightPrice={true}
              />
            </div>
          </div>
          <div className="nolijump-btn" data-aos="zoom-in" data-aos-delay="400">
            <Link href="/reservation" className="btn-primary">
              Réserver une session
            </Link>
          </div>
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
