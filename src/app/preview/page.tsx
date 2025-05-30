"use client";

import React from "react";
import content from "../../../public/texts.json";
import GridGallery from "@/components/GridGallery";

export default function Preview() {
  return (
    <main>
      <GridGallery images={content.noliparc} title="Espace de jeux Noliparc" subtitle="Images de Quad" />
    </main>
  );
}
