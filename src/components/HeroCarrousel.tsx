"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const slides = [
  {
    video: "/videos/noli1.mp4",
    image: "/images/image-noliparc.png",
    subtitle: "Le plus grand parc indoor de Guadeloupe (1000 m²)",
    cta: "Découvrir l'espace",
    link: "#noliparc",
    label: "Nolijump",
  },
  {
    video: "/videos/noli2.mp4",
    image: "/images/image-nolijump-texte.png",
    subtitle: "Viens t'amuser dans le premier parc de trampoline de Guadeloupe !",
    cta: "Découvrir l'espace",
    link: "/nolijump",
    label: "Noliparc",
  },
];

export default function HeroCarousel() {
  const swiperRef = useRef<any>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Lance la vidéo de l'index actif, remet à zéro les autres
  const playActiveVideo = (idx: number) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === idx) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  // Au montage, lance la première vidéo après un léger délai
  useEffect(() => {
    setTimeout(() => playActiveVideo(0), 50);
  }, []);

  // Au changement de slide, on met à jour activeIndex et on relance la vidéo
  const handleSlideChange = (swiper: any) => {
    const idx = swiper.activeIndex % slides.length;
    setActiveIndex(idx);
    playActiveVideo(idx);
  };

  // Quand une vidéo termine, on passe à la slide suivante ou on boucle
  const handleVideoEnded = () => {
    if (!swiperRef.current) return;
    if (activeIndex === slides.length - 1) {
      swiperRef.current.slideTo(0, 0);
    } else {
      swiperRef.current.slideNext();
    }
  };

  return (
    <>
      <header
        className="hero-carousel"
        style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
      >
        <Swiper
          loop={false}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
          className="hero-swiper"
          style={{ width: "100%", height: "100%" }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="hero-slide" style={{ position: "relative", width: "100%", height: "100%" }}>
                {/* Vidéo en arrière‐plan */}
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className="hero-bg-video"
                  src={slide.video}
                  muted
                  playsInline
                  onEnded={handleVideoEnded}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 1,
                  }}
                />

                {/* Overlay du contenu */}
                <div
                  className="hero-overlay"
                  style={{
                    position: "relative",
                    zIndex: 2,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "2rem",
                    boxSizing: "border-box",
                  }}
                >
                  <Image
                    alt="logo"
                    src={slide.image}
                    width={1000}
                    height={1050}
                    className="image-noliparc"
                    style={{ maxWidth: "80%", height: "auto", marginBottom: "2rem" }}
                  />
                  <div className="hero-summary" style={{ color: "#fff" }}>
                    <h1
                      className="hero-title"
                      style={{
                        fontSize: "2rem",
                        textShadow: "0 2px 4px rgba(0,0,0,0.7)",
                        marginBottom: "1rem",
                      }}
                    >
                      {slide.subtitle}
                    </h1>
                    <Link href={slide.link} className="btn-primary" style={{ textDecoration: "none" }}>
                      <span
                      >
                        {slide.cta}
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Boutons glassmorphism */}
                {index === 0 && (
                  <button
                    onClick={() => swiperRef.current?.slideNext()}
                    aria-label="Aller à Nolijump"
                    className="glass-button"
                  >
                    <span>{slide.label}</span>
                    <svg className="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M10 17l5-5-5-5v10z" fill="#fff" />
                    </svg>
                  </button>
                )}
                {index === 1 && (
                  <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    aria-label="Retour à Noliparc"
                    className="noliparc-button"
                  >
                    <svg className="arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M14 7l-5 5 5 5V7z" fill="#fff" />
                    </svg>
                    <span>{slide.label}</span>
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </header>

      {/* Styles CSS en JSX */}
      <style jsx>{`
        .glass-button,
        .noliparc-button {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          z-index: 3;
          transition: background 0.2s ease;
        }

        .glass-button:hover,
        .noliparc-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .arrow-svg {
          animation: slideArrow 1.5s infinite ease-in-out;
        }

        @keyframes slideArrow {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
          100% {
            transform: translateX(0);
          }
        }

        /* Position par défaut en bas à droite */
        .glass-button {
          bottom: 5rem;
          right: 1.5rem;
        }
        .noliparc-button {
          bottom: 5rem;
          right: 1.5rem;
        }

        /* Sur petit écran (≤ 768px), place le bouton en haut centré et ajuste la taille */
        @media (max-width: 768px) {
          .glass-button,
          .noliparc-button {
            bottom: auto;
            background: none;
            top: 1rem;
            left: 50%;
            right: auto;
            transform: translateX(-50%);
            width: auto;
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}
