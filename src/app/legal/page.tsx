"use client";

import { Box, Typography, Container, Link as MuiLink } from "@mui/material";
import Link from "next/link";

export default function LegalPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8, color: "#000" }}>
      {/* Section 1 : CGU */}
      <section id="cgu">
      <Box mb={10}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="black">
          Conditions Générales d'Utilisation (CGU)
        </Typography>

        <Typography variant="body1" paragraph>
          En date du 27 juillet 2025
        </Typography>
        
        <Typography variant="body1" paragraph>
          Les présentes conditions générales d'utilisation (dites « CGU ») ont pour objet l'encadrement juridique des modalités de mise à disposition du site et des services par Noliparc et de définir les conditions d'accès et d'utilisation des services par « l'Utilisateur ».
        </Typography>

        {[
          {
            title: "1. Objet et acceptation des CGU",
            content: "Les présentes conditions générales d'utilisation (ci-après les « CGU ») ont pour objet de définir les modalités de mise à disposition des services du site Noliparc (ci-après le « Site ») et leurs conditions d'utilisation par l'Utilisateur.\n\nTout accès et/ou utilisation du Site suppose l'acceptation et le respect de l'ensemble des termes des présentes CGU et leur acceptation inconditionnelle. Elles constituent donc un contrat entre Noliparc et l'Utilisateur.\n\nL'éditeur se réserve le droit de modifier le contenu de ces CGU à tout moment. Elles s'imposent donc à l'Utilisateur qui est invité à les consulter régulièrement.",
          },
          {
            title: "2. Description des services fournis",
            content: "Le Site a pour objet de fournir une plateforme permettant aux utilisateurs de :\n- Consulter les informations sur le parc Noliparc\n- Effectuer des réservations en ligne\n- Créer et gérer un compte utilisateur\n- Recevoir des informations et actualités\n\nNoliparc s'efforce de fournir sur le Site des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour.",
          },
          {
            title: "3. Conditions d'accès et d'utilisation",
            content: "3.1. L'accès au Site est gratuit, hors coût de connexion au réseau internet facturé par les fournisseurs d'accès.\n\n3.2. L'Utilisateur s'engage à utiliser le Site conformément aux présentes CGU, aux lois et réglementations en vigueur.\n\n3.3. La création d'un espace personnel est réservée aux personnes majeures capables de contracter aux conditions prévues par les présentes CGU.",
          },
          {
            title: "4. Propriété intellectuelle",
            content: "4.1. La structure du Site, ainsi que les textes, graphiques, images, sons et vidéos la composant, sont la propriété de Noliparc ou de ses partenaires. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie des éléments du Site sans l'accord préalable et écrit de Noliparc est strictement interdite et serait susceptible de constituer un acte de contrefaçon sanctionné par les articles L.335-2 et suivants du Code de la propriété intellectuelle.\n\n4.2. Les marques et logos figurant sur le site sont des marques déposées. Toute reproduction ou utilisation de ces marques, sans autorisation préalable et écrite de leur propriétaire, est interdite.",
          },
          {
            title: "5. Responsabilités",
            content: "5.1. Noliparc s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur le Site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu.\n\n5.2. Noliparc ne peut être tenue responsable des dommages directs ou indirects qui pourraient résulter de l'accès ou de l'utilisation du Site, y compris l'inaccessibilité, les pertes de données, détériorations, destructions ou virus qui pourraient affecter l'équipement informatique de l'utilisateur.\n\n5.3. L'Utilisateur s'engage à ne pas perturber le fonctionnement du Site et à ne pas tenter d'accéder de manière frauduleuse à des données personnelles.",
          },
          {
            title: "6. Données personnelles et cookies",
            content: "6.1. Les données à caractère personnel collectées sur le Site font l'objet d'un traitement informatique destiné à la gestion des utilisateurs, des commandes et des relations commerciales.\n\n6.2. Conformément à la loi « informatique et libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), l'Utilisateur dispose d'un droit d'accès, de rectification, de suppression, de limitation, d'opposition et de portabilité des données le concernant.\n\n6.3. Pour exercer ces droits, l'Utilisateur peut contacter le Délégué à la Protection des Données (DPO) à l'adresse suivante : dpo@noliparc.fr ou par courrier à l'adresse du siège social.",
          },
          {
            title: "7. Droit applicable et juridiction compétente",
            content: "7.1. Les présentes CGU sont soumises au droit français.\n\n7.2. En cas de litige, les tribunaux français seront seuls compétents.\n\n7.3. Pour toute question ou réclamation concernant l'utilisation du Site, l'Utilisateur peut contacter Noliparc à l'adresse contact@noliparc.fr ou par courrier à l'adresse du siège social.",
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
          Mentions Légales
        </Typography>

        <Typography variant="body1" paragraph>
          En vigueur au 27/07/2025
        </Typography>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            1. Éditeur du site
          </Typography>
          <Typography variant="body1" paragraph>
            Le site internet accessible à l'adresse https://www.noliparc.fr (ci-après « le Site ») est édité par :
          </Typography>
          <Box component="address" sx={{ fontStyle: 'normal' }}>
            <Typography variant="body1">
              <strong>NOLIPARC</strong><br />
              Société par actions simplifiée au capital de 1 000 000 €<br />
              Siège social : 10 ZAC DE NOLIVIER, 97115 SAINTE-ROSE<br />
              Tél. : +590 590 85 86 20<br />
              Email : contact@noliparc.fr<br />
              SIRET : 81273584300011<br />
              RCS Basse-Terre 812 735 843<br />
              N° TVA intracommunautaire : FR 70 812735843<br />
              Directeur de la publication : [Nom du Directeur]
            </Typography>
          </Box>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            2. Hébergement
          </Typography>
          <Typography variant="body1" paragraph>
            Le Site est hébergé par :
          </Typography>
          <Box component="address" sx={{ fontStyle: 'normal' }}>
            <Typography variant="body1">
              <strong>OVH SAS</strong><br />
              Siège social : 2 rue Kellermann - 59100 Roubaix - France<br />
              Téléphone : 1007
            </Typography>
          </Box>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            3. Propriété intellectuelle
          </Typography>
          <Typography variant="body1" paragraph>
            3.1. L'ensemble des éléments constituant le Site (textes, images, vidéos, marques, logos, bases de données, etc.) sont la propriété exclusive de NOLIPARC ou de ses partenaires et sont protégés par les lois relatives à la propriété intellectuelle.
          </Typography>
          <Typography variant="body1" paragraph>
            3.2. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie des éléments du Site sans l'accord préalable et écrit de NOLIPARC est strictement interdite et constituerait un acte de contrefaçon sanctionné par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            4. Données personnelles
          </Typography>
          <Typography variant="body1" paragraph>
            4.1. Conformément à la loi « informatique et libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression, de limitation, d'opposition et de portabilité des données vous concernant.
          </Typography>
          <Typography variant="body1" paragraph>
            4.2. Pour exercer ces droits, vous pouvez contacter notre Délégué à la Protection des Données (DPO) :
          </Typography>
          <Box component="address" sx={{ fontStyle: 'normal', mb: 2 }}>
            <Typography variant="body1">
              Par email : dpo@noliparc.fr<br />
              Par courrier : DPO NOLIPARC - 10 ZAC DE NOLIVIER, 97115 SAINTE-ROSE
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            4.3. Pour plus d'informations sur la gestion de vos données personnelles, nous vous invitons à consulter notre <MuiLink href="#pdc" component={Link} color="primary">Politique de Confidentialité</MuiLink>.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            5. Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            5.1. Le Site utilise des cookies pour améliorer votre expérience de navigation et réaliser des statistiques de visites.
          </Typography>
          <Typography variant="body1" paragraph>
            5.2. Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du Site pourraient ne plus être accessibles.
          </Typography>
          <Typography variant="body1">
            5.3. Pour en savoir plus sur l'utilisation des cookies, consultez notre <MuiLink href="/cookies" component={Link} color="primary">Politique des Cookies</MuiLink>.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            6. Responsabilité
          </Typography>
          <Typography variant="body1" paragraph>
            6.1. NOLIPARC s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur le Site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
          </Typography>
          <Typography variant="body1" paragraph>
            6.2. NOLIPARC ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition sur le Site.
          </Typography>
          <Typography variant="body1">
            6.3. L'utilisateur reconnaît utiliser les informations et les données accessibles sur le Site sous sa responsabilité exclusive.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            7. Droit applicable et juridiction compétente
          </Typography>
          <Typography variant="body1" paragraph>
            7.1. Les présentes mentions légales sont soumises au droit français.
          </Typography>
          <Typography variant="body1">
            7.2. En cas de litige, les tribunaux français seront seuls compétents.
          </Typography>
        </Box>
      </Box>

      </section>

      {/* Section 3 : Politique de confidentialité */}
      <section id="pdc">
  <Box>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="black">
          Politique de Confidentialité
        </Typography>

        <Typography variant="body1" paragraph>
          Dernière mise à jour : 27 juillet 2025
        </Typography>

        <Typography variant="body1" paragraph>
          La présente politique de confidentialité s'applique au site internet NOLIPARC (ci-après le « Site ») et a pour but de vous informer sur la manière dont nous collectons, utilisons, partageons et protégeons vos données à caractère personnel conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « informatique et libertés » du 6 janvier 1978 modifiée.
        </Typography>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            1. Responsable du traitement
          </Typography>
          <Typography variant="body1" paragraph>
            Le responsable du traitement des données est NOLIPARC, société par actions simplifiée au capital de 1 000 000 €, dont le siège social est situé 10 ZAC DE NOLIVIER 97115 SAINTE-ROSE, immatriculée au RCS de Basse-Terre sous le numéro 812 735 843.
          </Typography>
          <Typography variant="body1">
            Le Délégué à la Protection des Données (DPO) peut être contacté à l'adresse : dpo@noliparc.fr
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            2. Données collectées
          </Typography>
          <Typography variant="body1" paragraph>
            Nous collectons les données suivantes :
          </Typography>
          <ul>
            <li><strong>Données d'identification :</strong> civilité, nom, prénom, adresse email, numéro de téléphone, date de naissance</li>
            <li><strong>Données de connexion :</strong> adresse IP, logs, identifiants de connexion</li>
            <li><strong>Données de navigation :</strong> pages consultées, date et heure d'accès, durée de consultation</li>
            <li><strong>Données de paiement :</strong> informations nécessaires au traitement des paiements (ces données sont directement collectées par notre prestataire de paiement agréé)</li>
            <li><strong>Données de préférences :</strong> centres d'intérêt, préférences de communication</li>
          </ul>
          <Typography variant="body1" paragraph>
            Les données marquées d'un astérisque dans les formulaires de collecte sont obligatoires. En leur absence, le service demandé ne pourra pas être fourni.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            3. Finalités du traitement
          </Typography>
          <Typography variant="body1" paragraph>
            Vos données sont traitées pour les finalités suivantes :
          </Typography>
          <ul>
            <li>Gestion de votre compte utilisateur</li>
            <li>Traitement et suivi de vos réservations</li>
            <li>Service client et support</li>
            <li>Envoi d'informations et de newsletters (avec votre consentement)</li>
            <li>Amélioration de nos services et personnalisation de votre expérience</li>
            <li>Respect de nos obligations légales et réglementaires</li>
            <li>Prévention des fraudes et lutte contre la fraude</li>
          </ul>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            4. Base légale du traitement
          </Typography>
          <Typography variant="body1" paragraph>
            Le traitement de vos données est fondé sur :
          </Typography>
          <ul>
            <li>L'exécution d'un contrat (gestion de votre compte, traitement des réservations)</li>
            <li>Votre consentement (envoi de newsletters, cookies non essentiels)</li>
            <li>L'obligation légale (conservation des factures, lutte contre la fraude)</li>
            <li>L'intérêt légitime (amélioration des services, sécurité du site)</li>
          </ul>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            5. Destinataires des données
          </Typography>
          <Typography variant="body1" paragraph>
            Vos données sont destinées à NOLIPARC et peuvent être transmises à :
          </Typography>
          <ul>
            <li>Nos prestataires techniques (hébergeur, éditeur de logiciel)</li>
            <li>Nos prestataires de paiement</li>
            <li>Nos partenaires commerciaux (uniquement avec votre consentement explicite)</li>
            <li>Les autorités judiciaires ou administratives compétentes, sur demande expresse</li>
          </ul>
          <Typography variant="body1" paragraph>
            Nous exigeons de tous nos sous-traitants qu'ils mettent en œuvre des mesures de sécurité appropriées pour protéger vos données.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            6. Transferts de données hors UE
          </Typography>
          <Typography variant="body1" paragraph>
            Certains de nos sous-traitants peuvent être situés en dehors de l'Union Européenne. Dans ce cas, nous nous assurons que :
          </Typography>
          <ul>
            <li>Le pays bénéficie d'une décision d'adéquation de la Commission européenne</li>
            <li>Des clauses contractuelles types de la Commission européenne ont été mises en place</li>
            <li>Des règles d'entreprise contraignantes ont été adoptées</li>
          </ul>
          <Typography variant="body1">
            Vous pouvez obtenir plus d'informations sur les garanties mises en place en contactant notre DPO.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            7. Durée de conservation
          </Typography>
          <Typography variant="body1" paragraph>
            Vos données sont conservées pour la durée nécessaire à l'accomplissement des finalités pour lesquelles elles ont été collectées :
          </Typography>
          <ul>
            <li>Données de compte inactif : 3 ans après la dernière activité</li>
            <li>Données de navigation : 13 mois</li>
            <li>Données de facturation : 10 ans (obligation légale)</li>
            <li>Données relatives à l'exercice des droits : 5 ans</li>
          </ul>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            8. Sécurité des données
          </Typography>
          <Typography variant="body1" paragraph>
            Nous mettons en œuvre des mesures techniques et organisationnelles pour assurer la sécurité et la confidentialité de vos données, notamment :
          </Typography>
          <ul>
            <li>Chiffrement des données sensibles</li>
            <li>Authentification forte pour l'accès aux comptes</li>
            <li>Sauvegardes régulières</li>
            <li>Protection contre les accès non autorisés</li>
            <li>Procédures de gestion des incidents</li>
          </ul>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            9. Vos droits
          </Typography>
          <Typography variant="body1" paragraph>
            Conformément à la réglementation en vigueur, vous disposez des droits suivants :
          </Typography>
          <ul>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification de vos données</li>
            <li>Droit à l'effacement de vos données (droit à l'oubli)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité de vos données</li>
            <li>Droit d'opposition au traitement</li>
            <li>Définition de directives relatives au sort de vos données après votre décès</li>
          </ul>
          <Typography variant="body1" paragraph>
            Pour exercer ces droits, vous pouvez nous contacter :
          </Typography>
          <Box component="address" sx={{ fontStyle: 'normal', mb: 2 }}>
            <Typography variant="body1">
              Par email : dpo@noliparc.fr<br />
              Par courrier : DPO NOLIPARC - 10 ZAC DE NOLIVIER, 97115 SAINTE-ROSE
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Toute demande doit être accompagnée d'une copie d'un titre d'identité en cours de validité. Nous nous engageons à vous répondre dans un délai maximum d'un mois à compter de la réception de votre demande complète.
          </Typography>
          <Typography variant="body1">
            En cas de réclamation, vous pouvez contacter la CNIL : <MuiLink href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" color="primary">www.cnil.fr</MuiLink>
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            10. Cookies et traceurs
          </Typography>
          <Typography variant="body1" paragraph>
            Notre Site utilise des cookies pour :
          </Typography>
          <ul>
            <li>Assurer le bon fonctionnement du Site</li>
            <li>Mémoriser vos préférences</li>
            <li>Établir des statistiques de fréquentation</li>
            <li>Personnaliser votre expérience</li>
          </ul>
          <Typography variant="body1" paragraph>
            Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités pourraient ne plus être accessibles.
          </Typography>
          <Typography variant="body1">
            Pour plus d'informations, consultez notre <MuiLink href="/cookies" component={Link} color="primary">Politique des Cookies</MuiLink>.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
            11. Modification de la politique de confidentialité
          </Typography>
          <Typography variant="body1" paragraph>
            Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. La date de la dernière mise à jour sera indiquée en haut du document.
          </Typography>
          <Typography variant="body1">
            Nous vous conseillons de consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
          </Typography>
        </Box>
      </Box>
      </section>
        <Box mt={6}>
          <Typography variant="body2" color="black">
            Dernière mise à jour : 27 juillet 2025
          </Typography>
        </Box>
    </Container>
  );
}

