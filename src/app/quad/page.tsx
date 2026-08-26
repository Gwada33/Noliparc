"use client";

import React from "react";
import content from "@/data/texts.json";
import GridGallery from "@/components/GridGallery";

export default function QuadPage() {
  return (
    <>
      <header className="page-hero">
        <h1>Les Quads 🏍️</h1>
        <p>
          Offrez à vos enfants une expérience inoubliable avec notre parcours quad
          sécurisé et fun, encadré par notre équipe.
        </p>
      </header>
      <GridGallery
        images={content.quads}
        title="Le parcours quad en images"
      />
    </>
  );
}
