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
    <main>
      <GridGallery
        images={images}
        title="Espace de jeux Noliparc"
        subtitle="Images de Quad"
      />
    </main>
  );
}
