"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules"
import Image from "next/image"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/thumbs"
import "swiper/css/free-mode"
import Footer from "./Footer"

export interface GalleryImage {
  original: string;
  originalAlt: string;
  title?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
}

export default function ImageGallery({ images, title, subtitle }: ImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!images || images.length === 0) {
    return <div className="gallery-empty">No images to display</div>;
  }

  return (
    <div className="gallery-container">
      {(title || subtitle) && (
        <div className="gallery-header">
          {title && <h1 className="gallery-title">{title}</h1>}
          {subtitle && <p className="gallery-subtitle">{subtitle}</p>}
        </div>
      )}

      {/* Main Swiper */}
      <div className="gallery-main">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          className="main-swiper"
        >
          {images.map((image) => (
            <SwiperSlide key={image}>
              <div className="gallery-slide">
                <div className="gallery-image-container">
                  <Image
                    src={image.original || "/placeholder.svg"}
                    alt={image.originalAlt}
                    fill
                    className="gallery-image"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  <div className="gallery-image-overlay" />
                </div>
                {image.title && (
                  <div className="gallery-caption">
                    <h3 className="gallery-caption-title">{image.title}</h3>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button className="swiper-button-prev-custom gallery-nav-button gallery-nav-prev">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button className="swiper-button-next-custom gallery-nav-button gallery-nav-next">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Mobile-optimized single image view */}
      <div className="gallery-mobile">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="mobile-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`mobile-${image}`}>
              <div className="gallery-mobile-slide">
                <div className="gallery-mobile-image-container">
                  <Image
                    src={image.original || "/placeholder.svg"}
                    alt={image.originalAlt}
                    fill
                    className="gallery-mobile-image"
                    sizes="100vw"
                    priority={index === 0}
                  />
                </div>
                {image.title && (
                  <div className="gallery-mobile-caption">
                    <h3 className="gallery-mobile-caption-title">{image.title}</h3>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
