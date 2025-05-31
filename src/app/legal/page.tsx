import { Box, Typography, Container } from "@mui/material";

export default function LegalPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8, color: "#000" }}>
      {/* Section 1 : CGU */}

      <section id="cgu">
      <Box mb={10}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="black">
          Conditions Générales d’Utilisation (CGU)
        </Typography>

        <Typography variant="body1" paragraph>
          Bienvenue sur le site de Noliparc. En accédant à notre site, vous acceptez sans réserve les présentes Conditions Générales d’Utilisation.
        </Typography>

        {[
          {
            title: "1. Objet du site",
            content: "Le site www.noliparc.fr a pour objectif de présenter les activités, horaires, services et actualités du parc Noliparc. Il permet également aux utilisateurs de réserver en ligne ou de créer un compte.",
          },
          {
            title: "2. Accès au site",
            content: "Le site est accessible gratuitement à tout utilisateur disposant d’un accès à Internet. Certains services peuvent nécessiter une inscription préalable.",
          },
          {
            title: "3. Propriété intellectuelle",
            content: "Tous les éléments du site (textes, images, vidéos, logos) sont protégés par le droit d’auteur et sont la propriété exclusive de Noliparc. Toute reproduction non autorisée est interdite.",
          },
          {
            title: "4. Données personnelles",
            content: "Les données collectées via le site sont utilisées uniquement dans le cadre des services proposés. Conformément à la loi, vous disposez d’un droit d’accès, de rectification et de suppression de vos données.",
          },
          {
            title: "5. Responsabilité",
            content: "Noliparc ne peut être tenu responsable en cas de dysfonctionnement du site, ou d’utilisation non conforme des services proposés.",
          },
          {
            title: "6. Modifications",
            content: "Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs sont invités à les consulter régulièrement.",
          },
        ].map((item, index) => (
          <Box mt={4} key={index}>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
              {item.title}
            </Typography>
            <Typography variant="body1">{item.content}</Typography>
          </Box>
        ))}
      </Box>
      </section>

      {/* Section 2 : Mentions légales */}
      <section id="ml">
      <Box mb={10}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="black">
          Mentions légales
        </Typography>

        <Typography variant="body1" >
          Conformément aux articles 6-III et 19 de la Loi pour la Confiance dans l'Économie Numérique, voici les informations légales :
        </Typography>

        <Box mt={3}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            Éditeur du site
          </Typography>
          <Typography variant="body1" >
            Nom : Noliparc<br />
            Adresse : 10 ZAC DE NOLIVIER 97115 SAINTE-ROSE<br />
            Email : contact@noliparc.fr<br />
            SIRET : 81273584300011
          </Typography>
        </Box>
        <Box mt={3}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            Propriété intellectuelle
          </Typography>
          <Typography variant="body1">
            L’ensemble des contenus présents sur le site sont protégés par les lois en vigueur et sont la propriété exclusive de Noliparc.
          </Typography>
        </Box>
      </Box>

      </section>

      {/* Section 3 : Politique de confidentialité */}
      <section id="pdc">
  <Box >
        <Typography variant="h3" gutterBottom fontWeight="bold" color="black">
          Politique de Confidentialité
        </Typography>

        <Typography variant="body1" paragraph>
          La présente politique de confidentialité explique comment Noliparc recueille, utilise et protège vos données personnelles.
        </Typography>

        <Box mt={3}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            1. Collecte des données
          </Typography>
          <Typography variant="body1">
            Nous collectons uniquement les informations nécessaires à la fourniture de nos services : nom, adresse e-mail, données de navigation, etc.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            2. Utilisation des données
          </Typography>
          <Typography variant="body1">
            Vos données sont utilisées pour améliorer l’expérience utilisateur, assurer le suivi des réservations et envoyer des communications pertinentes.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            3. Partage des données
          </Typography>
          <Typography variant="body1">
            Vos données ne sont jamais revendues. Elles peuvent être partagées avec des prestataires techniques uniquement pour le bon fonctionnement du site.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            4. Sécurité
          </Typography>
          <Typography variant="body1">
            Nous mettons en œuvre toutes les mesures nécessaires pour garantir la sécurité de vos données personnelles.
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            5. Vos droits
          </Typography>
          <Typography variant="body1">
            Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données personnelles.
          </Typography>
        </Box>
      </Box>
      </section>
        <Box mt={6}>
          <Typography variant="body2" color="black">
            Dernière mise à jour : 28 mai 2025
          </Typography>
        </Box>
    </Container>
  );
}

