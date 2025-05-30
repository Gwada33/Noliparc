import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  {
    video: '/videos/noli1.mp4',
    image: '/images/image-noliparc.png',
    subtitle: 'Le plus grand parc indoor de Guadeloupe',
    cta: 'Découvrir l\'espace',
    link: '#noliparc'
  },
  {
    video: '/videos/noli2.mp4',
    image: '/images/image-nolijump-texte.png',
    subtitle: 'Viens t\'amuser dans le premier parc de trampoline de Guadeloupe!',
    cta: 'Découvrir l\'espace',
    link: "/nolijump"
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  useEffect(() => {
    const video = videoRefs.current[currentSlide]
    video?.play()
  }, [currentSlide])

  return (
    <header className="hero-carousel">
      <div
        className="hero-slide-container"
        style={{ transform: `translateX(-${currentSlide * 50}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="hero-slide" key={index}>
            <video
              ref={(el) => {
  videoRefs.current[index] = el
}}

              className="hero-bg-video"
              src={slide.video}
              muted
              autoPlay
              playsInline
              onEnded={handleNextSlide}
            />
            <div className="hero-overlay">
              <Image
                alt="logo"
                src={slide.image}
                width={1000}
                height={1050}
                className="image-noliparc"
              />
              <div className="hero-summary">
                <h1 className="hero-title">{slide.subtitle}</h1>
                <Link href={slide.link} className="btn-primary">
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </header>
  )
}
