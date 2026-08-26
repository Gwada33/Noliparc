"use client";

import React from "react";
import GridGallery from "@/components/GridGallery";

const imageCount = 14; // ou le nombre exact d'images
const images = Array.from({ length: imageCount }, (_, i) => ({
  original: `/images/noliparc/noliparc-${i + 1}.jpeg`,
  originalAlt: `noliparc-${i + 1}.jpeg`,
}));

export default function Preview() {
  return (
    <>
      <header className="page-hero">
        <h1>Espace de jeux Noliparc</h1>
        <p>
          Découvrez nos structures de jeux, toboggans et piscines à balles en images.
        </p>
      </header>
      <GridGallery
        images={images}
        title="Galerie photos"
      />
    </>
  );
}
