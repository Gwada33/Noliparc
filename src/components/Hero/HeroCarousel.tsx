"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import styles from "./Hero.module.css";

const slides = [
  {
    video: "https://ia600709.us.archive.org/25/items/noli1/noli1.mp4",
    image: "/images/image-noliparc.png",
    subtitle: "Le plus grand parc indoor de Guadeloupe (1000m²)",
    cta: "Découvrir l'espace",
    link: "#noliparc",
    label: "Nolijump",
  },
  {
    video: "https://ia600709.us.archive.org/25/items/noli1/noli2.mp4",
    image: "/images/image-nolijump-texte.png",
    subtitle:
      "Viens t'amuser dans le premier parc de trampoline de Guadeloupe !",
    cta: "Découvrir l'espace",
    link: "/nolijump",
    label: "Noliparc",
  },
];

export default function HeroCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Play active video, pause others
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

  // On mount, play first video after slight delay
  useEffect(() => {
    setTimeout(() => playActiveVideo(0), 50);
  }, []);

  // On slide change, update activeIndex and play video
  const handleSlideChange = (swiper: SwiperType) => {
    const idx = swiper.activeIndex % slides.length;
    setActiveIndex(idx);
    playActiveVideo(idx);
  };

  // When video ends, go to next slide or loop
  const handleVideoEnded = () => {
    if (!swiperRef.current) return;
    if (activeIndex === slides.length - 1) {
      swiperRef.current.slideTo(0, 0);
    } else {
      swiperRef.current.slideNext();
    }
  };

  return (
    <header className={styles.heroCarousel}>
      <Swiper
        loop={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        className={styles.heroSwiper}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={styles.heroSlide}>
              {/* Background video */}
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className={styles.heroBgVideo}
                src={slide.video}
                muted
                playsInline
                onEnded={handleVideoEnded}
              />

              {/* Overlay content */}
              <div className={styles.heroOverlay}>
                <Image
                  alt="logo"
                  src={slide.image}
                  fetchPriority="high"
                  width={1000}
                  height={1050}
                  className={styles.heroLogo}
                />
                <div className={styles.heroSummary}>
                  <h1 className={styles.heroTitle}>{slide.subtitle}</h1>
                  <Link href={slide.link} className={styles.heroCta}>
                    <span>{slide.cta}</span>
                  </Link>
                </div>
              </div>

              {/* Glass navigation buttons */}
              {index === 0 && (
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Aller à Nolijump"
                  className={styles.glassButton}
                >
                  <span>{slide.label}</span>
                  <svg
                    className={styles.arrowSvg}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M10 17l5-5-5-5v10z" fill="#fff" />
                  </svg>
                </button>
              )}
              {index === 1 && (
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Retour à Noliparc"
                  className={styles.noliparcButton}
                >
                  <svg
                    className={styles.arrowSvg}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
  );
}
