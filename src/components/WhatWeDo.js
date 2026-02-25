"use client"; // Ensures this component is rendered on the client-side

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { scrollReveal } from "@/lib/animations/scrollReveal";
import { useTranslations } from "next-intl";
import { initGsap } from "@/lib/animations/config";

export default function What_we_do() {
  const t = useTranslations("ServicesSection");
  const comp = useRef(null);

  useGSAP(() => {
    initGsap();
    scrollReveal(comp.current);
  }, { scope: comp });

  return (
    <h1
      ref={comp}
      className="text-5xl md:text-6xl font-bold mb-10 text-center opacity-0"
    >
      {t("title")}
    </h1>
  );
}
