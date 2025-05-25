"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import content from "../../public/texts.json";
import Formule from "@/components/Formule";
import {
  FaRulerCombined,
  FaUsers,
  FaClock,
  FaGavel,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import HeroCarousel from "@/components/HeroCarrousel";

const icons: any = {
  FaRulerCombined: FaRulerCombined,
  FaUsers: FaUsers,
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
        <Card
          elevation={4}
          sx={{
            maxWidth: 1200,
            margin: "auto",
            border: "none",
            boxShadow: "none",
            mt: 8,
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <FaClock size={40} style={{ marginRight: 12 }} />
              <Typography variant="h4" fontWeight="bold">
                Horaires (1 à 10 ans)
              </Typography>
            </Box>

          
<Grid container spacing={4} alignItems="stretch">
  {/* Partie gauche : horaires */}
  <Grid xs={12} md={7}>
    <Grid container spacing={4}>
      {/* Vacances scolaires */}
      <Grid xs={12} sm={6}>
        <Box display="flex" alignItems="center" mb={1}>
          <FaCalendarAlt size={22} style={{ marginRight: 10 }} />
          <Typography variant="h6" fontWeight="bold">
            Vacances scolaires
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight={600} fontSize={22}>
          Lun. <span style={{ color: "orange" }}>Fermé</span>
          <br />
          Mar. <span style={{ color: "orange" }}>10h-18h</span>
          <br />
          Mer. <span style={{ color: "orange" }}>10h-18h</span>
          <br />
          Jeu. <span style={{ color: "orange" }}>10h-18h</span>
          <br />
          Ven. <span style={{ color: "orange" }}>10h-18h</span>
          <br />
          Sam. <span style={{ color: "orange" }}>10h-18h</span>
          <br />
          Dim. <span style={{ color: "orange" }}>Fermé</span>
        </Typography>
      </Grid>

      {/* Périodes scolaires */}
      <Grid  xs={12} sm={6}>
        <Box display="flex" alignItems="center" mb={1}>
          <FaCalendarAlt size={22} style={{ marginRight: 10 }} />
          <Typography variant="h6" fontWeight="bold">
            Périodes scolaires
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight={600} fontSize={22}>
          Lun. <span style={{ color: "orange" }}>Fermé</span>
          <br />
          Mar. <span style={{ color: "orange" }}>Fermé</span>
          <br />
          Mer. <span style={{ color: "orange" }}>10h-18h</span>
          <br />
          Jeu. <span style={{ color: "orange" }}>Fermé</span>
          <br />
          Ven. <span style={{ color: "orange" }}>Fermé</span>
          <br />
          Sam. <span style={{ color: "orange" }}>10h-18h</span>
          <br />
          Dim. <span style={{ color: "orange" }}>Fermé</span>
        </Typography>
      </Grid>
    </Grid>
  </Grid>

  {/* Partie droite : image */}
  <Grid
    xs={12}
    md={5}
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <Box
      component="img"
      src="https://www.100gwada.com/wp-content/uploads/2024/08/NoliParc-6-1200x800.jpg"
      alt="Enfants jouant au parc"
      sx={{
        width: "100%",
        maxHeight: 280,
        objectFit: "cover",
        borderRadius: 4,
      }}
    />
  </Grid>
</Grid>

            <Divider sx={{ my: 4 }} />
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              fontSize={16}
            >
              Ces horaires peuvent être soumis à modification en cas d'événement
              spécial.
            </Typography>
          </CardContent>
        </Card>

        <div className="feature-container">
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
                    alt="image-noliparc"
                    className="rounded"
                    width={1269}
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
            {content.informations.items.map((item, index) => {
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
              Viens sauter, courir et t'amuser dans notre espace trampoline
              unique en Guadeloupe ! Adapté à tous les âges, Nolijump te propose
              des formules variées pour tous les niveaux d’énergie 🎉
            </p>
            <Card
              elevation={4}
              sx={{
                maxWidth: 1200,
                margin: "auto",
                border: "none",
                boxShadow: "none",
                mt: 8,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <FaClock size={40} style={{ marginRight: 12 }} />
                  <Typography variant="h4" fontWeight="bold">
                    Horaires
                  </Typography>
                </Box>

                <Grid container spacing={4} alignItems="stretch">
                  {/* Partie gauche : horaires */}
                  <Grid item xs={12} md={7}>
                    <Box
                      component="ul"
                      sx={{ paddingLeft: 0, listStyle: "none", margin: 0 }}
                    >
                      {/* Vacances scolaires */}
                      <Box component="li" mb={3}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <FaCalendarAlt
                            size={22}
                            style={{ marginRight: 10 }}
                          />
                          <Typography variant="h6" fontWeight="bold">
                            Vacances scolaires :
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontSize={18}>
                          Lun. <span style={{ color: "orange" }}>Fermé</span>
                          <br />
                          Mar. <span style={{ color: "orange" }}>
                            10h-12h
                          </span>{" "}
                          (3-6 ans),{" "}
                          <span style={{ color: "orange" }}>12h-18h</span> (7-99
                          ans)
                          <br />
                          Mer. <span style={{ color: "orange" }}>
                            10h-12h
                          </span>{" "}
                          (3-6 ans),{" "}
                          <span style={{ color: "orange" }}>12h-18h</span> (7-99
                          ans)
                          <br />
                          Jeu. <span style={{ color: "orange" }}>
                            10h-12h
                          </span>{" "}
                          (3-6 ans),{" "}
                          <span style={{ color: "orange" }}>12h-18h</span> (7-99
                          ans)
                          <br />
                          Ven. <span style={{ color: "orange" }}>
                            10h-12h
                          </span>{" "}
                          (3-6 ans),{" "}
                          <span style={{ color: "orange" }}>12h-18h</span> (7-99
                          ans)
                          <br />
                          Sam. <span style={{ color: "orange" }}>
                            10h-12h
                          </span>{" "}
                          (3-6 ans),{" "}
                          <span style={{ color: "orange" }}>12h-18h</span> (7-99
                          ans)
                          <br />
                          Dim. <span style={{ color: "orange" }}>
                            13h-17h
                          </span>{" "}
                          (7-99 ans)
                        </Typography>
                      </Box>

                      {/* Périodes scolaires */}
                      <Box component="li">
                        <Box display="flex" alignItems="center" mb={1}>
                          <FaCalendarAlt
                            size={22}
                            style={{ marginRight: 10 }}
                          />
                          <Typography variant="h6" fontWeight="bold">
                            Périodes scolaires :
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontSize={18}>
                          Lun. <span style={{ color: "orange" }}>Fermé</span>
                          <br />
                          Mar. <span style={{ color: "orange" }}>Fermé</span>
                          <br />
                          Mer. <span style={{ color: "orange" }}>
                            10h-12h
                          </span>{" "}
                          (3-6 ans),{" "}
                          <span style={{ color: "orange" }}>12h-18h</span> (7-99
                          ans)
                          <br />
                          Jeu. <span style={{ color: "orange" }}>Fermé</span>
                          <br />
                          Ven. <span style={{ color: "orange" }}>Fermé</span>
                          <br />
                          Sam. <span style={{ color: "orange" }}>
                            10h-12h
                          </span>{" "}
                          (3-6 ans),{" "}
                          <span style={{ color: "orange" }}>12h-18h</span> (7-99
                          ans)
                          <br />
                          Dim. <span style={{ color: "orange" }}>
                            13h-17h
                          </span>{" "}
                          (7-99 ans)
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Partie droite : image */}
                  <Grid
                    item
                    xs={12}
                    md={5}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box
                      component="img"
                      src="https://www.100gwada.com/wp-content/uploads/2024/08/NoliParc-6-1200x800.jpg"
                      alt="Enfants jouant au parc"
                      sx={{
                        width: "100%",
                        maxHeight: 280,
                        objectFit: "cover",
                        borderRadius: 4,
                        boxShadow: 2,
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  fontSize={16}
                >
                  Ces horaires peuvent être soumis à modification en cas
                  d'événement spécial.
                </Typography>
              </CardContent>
            </Card>

            <div
              className="jump-pricing"
              data-aos="fade-up"
              data-aos-delay="300"
            >
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
            <div
              className="nolijump-btn"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <Link href="/reservation" className="btn-primary">
                Réserver une session
              </Link>
            </div>
          </div>
        </section>

        <footer className="cta" data-aos="fade-up">
          <div className="footer-content">
            <h2>{content.footer.title}</h2>
            <p>{content.footer.description}</p>
            <Link href="/newsletter" className="btn-secondary">
              {content.footer.cta}
            </Link>
          </div>

          <div className="footer-links">
            <ul>
              <li>
                <Link href="/mentions-legales">Mentions légales</Link>
              </li>
              <li>
                <Link href="/cgu">Conditions Générales d'Utilisation</Link>
              </li>
              <li>
                <Link href="/confidentialite">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/accessibilite">Accessibilité</Link>
              </li>
            </ul>
          </div>

          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} Noliparc. Tous droits réservés.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
