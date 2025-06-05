"use client";

import React from "react";
import content from "@/data/texts.json";
import GridGallery from "@/components/GridGallery";

export default function QuadPage() {
  return (
    <main>
      <GridGallery images={content.quads} title="Quad" subtitle="Images de Quad" />
    </main>
  );
}
