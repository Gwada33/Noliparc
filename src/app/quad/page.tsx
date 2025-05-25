import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quad - Noliparc",
  description: "Explorez nos circuits de quad et vivez l'aventure en plein air à Noliparc !",
};

export default function QuadPage() {
  return (
    <main className="home">
      <header className="hero">
        <video
          className="hero-bg-video"
          src="/videos/noli.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="true"
        />
        <div className="hero-overlay">
          <Image
            alt="quad"
            className="image-noliparc"
            width={1269}
            height={906}
            src="/images/quad.png"
          />
          <div className="hero-summary">
            <h1 className="hero-title">Découvrez le Quad à Noliparc</h1>
            <p>Partez à laventure sur nos circuits extérieurs en pleine nature !</p>
          </div>
        </div>
      </header>

      <section className="features">
        <div>
          <h2>Circuits adaptés à tous</h2>
          <p>
            Que vous soyez débutant ou amateur de sensations fortes, nos pistes de quad sont conçues pour tous les niveaux.
          </p>
        </div>

        <div>
          <h2>Encadrement sécurisé</h2>
          <p>
            Notre équipe vous accompagne pour garantir une expérience fun et en toute sécurité.
          </p>
        </div>

        <div>
          <h2>Réservez votre session</h2>
          <p>
            Réservation recommandée le week-end. Préparez-vous à faire le plein d’adrénaline !
          </p>
        </div>
      </section>
    </main>
  );
}
