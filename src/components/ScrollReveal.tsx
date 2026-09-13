"use client";

import { useEffect } from "react";

/*
 * Système de révélation au scroll (remplace AOS, beaucoup plus léger).
 * - Observe tous les éléments `[data-aos]` (y compris ceux ajoutés après coup,
 *   ex. événements chargés depuis l'API).
 * - Ajoute la classe `.aos-animate` quand ils entrent dans le viewport.
 * - Respecte `data-aos-delay` (délai en ms).
 * - Respecte `prefers-reduced-motion`.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      document
        .querySelectorAll<HTMLElement>("[data-aos]")
        .forEach((el) => el.classList.add("aos-animate"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.aosDelay || 0);
          if (delay > 0) el.style.transitionDelay = `${delay}ms`;
          el.classList.add("aos-animate");
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const attach = (el: Element) => observer.observe(el);

    document.querySelectorAll<HTMLElement>("[data-aos]").forEach(attach);

    // Contenu rendu plus tard (fetch API, etc.)
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.hasAttribute("data-aos")) attach(node);
          node.querySelectorAll?.("[data-aos]").forEach(attach);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}