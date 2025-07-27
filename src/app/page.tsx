"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import content from "@/data/texts.json";

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
});

import {
  FaRulerCombined,
  FaUsers,
  FaClock,
  FaGavel,
  FaSocks,
  FaCircle,
  FaFilePdf
} from "react-icons/fa";
import { MdNoFood } from "react-icons/md";
import { Box, Typography, ListItem, ListItemText, ListItemIcon, List, Button, Modal, IconButton } from "@mui/material";
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


const regles = [
    "Les enfants sont sous la responsabilité des accompagnateurs, vous devez donc en prévoir un nombre suffisant pour le groupe, Noliparc décline toute responsabilité, en cas d’accident, de vol ou de dommage.",
    "Les enfants doivent être munis obligatoirement de chaussettes par mesure d’hygiène sinon l’accès sera interdit (achat possible sur place).",
    "L’âge et la capacité indiqués sur chaque aire de jeux doivent être respectés.",
    "Il est interdit de manger ou de boire dans les aires de jeux.",
    "Les bijoux et accessoires sont interdits dans les aires de jeux.",
    "L’équipe de Noliparc se réserve le droit de refuser l’entrée au parc ou d’exclure du parc sans remboursement tout client ayant un mauvais comportement.",
    "Nos amis les animaux ne sont pas acceptés dans le parc par mesure d’hygiène.",
    "Il est interdit de grimper sur les filets des aires de jeux, de monter sur les toboggans en sens inverse, de sortir les jeux mobiles de leur parc.",
    "Pour des raisons de sécurité, il est interdit de courir dans le parc.",
    "Toute sortie est définitive.",
    "Goûter, boissons, aliments personnels sont strictement interdits dans l’enceinte du parc, sauf eau et aliments pour bébés.",
    "Toute entrée dans le parc, entraîne obligatoirement l’acceptation du présent règlement. En cas de non respect, l’accès au parc vous sera interdit et des dédommagements pourront vous être demandés."
  ];

// Style pour la modale
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '900px',
  height: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
};

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
              ["Dim.", "13h-17h"],
            ]}
          />

          <ScheduleTable
            title="Périodes scolaires"
            headers={["Jusqu'à 10 ans"]}
            data={[
              ["Lun.", "Fermé"],
              ["Mar.", "Fermé"],
              ["Mer.", "10h-17h"],
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
                <br />
                <span className="tarif-sub">5€ par  adulte supplémentaire</span>
              </span>
            </div>

            <div className="tarif-item">
              <span className="tarif-label">Chaussettes</span>
              <span className="tarif-value">
                <span className="tarif-sub">Adulte : 3€</span>
                <br />
                <span className="tarif-sub">Enfant : 2.50€</span>
              </span>
            </div>
          </section>

          <div className="formule-grid">
            <Formule
              title="Pass 4 entrées "
              variant="noliparc-anniv"
              subtitle="(Valable pour la prochaine visite)"
              durations={[{ time: "", price: "36€" }]}
              showIcons={false}
              highlightPrice={true}
              showButton={false}
            />

            <Formule
              title="Pass 7 entrées "
              variant="noliparc-anniv"
              subtitle="(Valable pour la prochaine visite)"
              durations={[{ time: "", price: "60€" }]}
              showIcons={false}
              highlightPrice={true}
              showButton={false}
            />
          </div>
        </div>


 <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: 4 }}>
      <Typography data-aos="fade-down" data-aos-delay="300" variant="h2" fontFamily={"Rubik, sans-serif"} fontWeight={600} color="#DB7C26" component="h2" gutterBottom>
        Règlement intérieur
      </Typography>
      <List>
        {regles.map((regle, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemIcon sx={{ minWidth: 30 }}>
              <FaCircle color="#000" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" data-aos="fade-down" data-aos-delay="100" color="text.primary">
                  {regle}
                </Typography>
              }
            />
          </ListItem>
        ))}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<FaFilePdf />}
            onClick={handleOpen}
            sx={{
              backgroundColor: '#DB7C26',
              '&:hover': {
                backgroundColor: '#c96f22',
              },
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: '8px',
            }}
          >
            Voir la décharge de responsabilité et d'autorisation parentale
          </Button>
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          disableEscapeKeyDown={false}
        >
          <Box sx={modalStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography id="modal-modal-title" color="#000000" variant="h5" component="h2">
                Décharge de responsabilité et d'autorisation parentale
              </Typography>
              <IconButton onClick={handleClose} sx={{ color: 'text.primary' }}>
                ✕
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, minHeight: 0, p: 0, m: 0, overflow: 'hidden', position: 'relative' }}>
              {/* Solution principale pour la plupart des navigateurs */}
              <object 
                data="https://ewyyikh0ws.ufs.sh/f/dpcit5LWLcSxdMZ5nqLWLcSxqA9Ruy1jCf5svknpPhI6MVN7#view=FitH&toolbar=0&navpanes=0" 
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ 
                  border: 'none', 
                  margin: 0, 
                  padding: 0,
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              >
                {/* Solution de secours pour les navigateurs qui ne supportent pas l'élément object */}
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p>Votre navigateur ne supporte pas l'affichage direct du PDF.</p>
                  <Button 
                    variant="contained"
                    href="https://ewyyikh0ws.ufs.sh/f/dpcit5LWLcSxdMZ5nqLWLcSxqA9Ruy1jCf5svknpPhI6MVN7"
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<FaFilePdf />}
                    sx={{
                      backgroundColor: '#DB7C26',
                      '&:hover': {
                        backgroundColor: '#c96f22',
                      },
                      fontWeight: 600,
                      padding: '10px 24px',
                      borderRadius: '8px',
                      mt: 2
                    }}
                  >
                    Télécharger le PDF
                  </Button>
                </div>
              </object>
            </Box>
          </Box>
        </Modal>
      </List>
    </Box>

        <MapView />

        <Footer />
      </main>
    </>
  );
}
