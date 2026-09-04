"use client";

import { useEffect, useRef, useState } from "react";

type Slide = { id: string; plate: string; title: string; src: string; alt: string };

// Imágenes en /public/repuestos-hero. Mapeadas por el contenido real de cada
// archivo del handoff (los nombres de origen venían cruzados).
const SLIDES: Slide[] = [
  {
    id: "bateria",
    plate: "12V · 20 Ah",
    title: "Batería Chilwee 6-DZF-20 de gel",
    src: "/repuestos-hero/hero-bateria.webp",
    alt: "Batería Chilwee 6-DZF-20 vista en dos ángulos",
  },
  {
    id: "kit",
    plate: "36/48V · KIT COMPLETO",
    title: "Kit controlador, sensores y acelerador D/R",
    src: "/repuestos-hero/hero-kit-controlador.webp",
    alt: "Kit de controlador con arnés, placa de sensores, estaño y acelerador con marcha atrás",
  },
  {
    id: "convertidor",
    plate: "48~60V · 1500 W",
    title: "Convertidor DC-DC 1500 W + acelerador de puño",
    src: "/repuestos-hero/hero-convertidor.webp",
    alt: "Convertidor DC-DC de 1500 W con acelerador de puño y cableado",
  },
];

const ROTATE_MS = 4500;

export default function RepuestosHeroShowcase() {
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    timer.current = setInterval(
      () => setI((n) => (n + 1) % SLIDES.length),
      ROTATE_MS,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function go(n: number) {
    if (timer.current) clearInterval(timer.current);
    setI(n);
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduce) {
      timer.current = setInterval(
        () => setI((k) => (k + 1) % SLIDES.length),
        ROTATE_MS,
      );
    }
  }

  return (
    <div className="rep-showcase">
      <span aria-hidden="true" className="rep-showcase-glow" />

      <div className="rep-showcase-stage">
        {SLIDES.map((s, n) => {
          const on = n === i;
          const behind = n < i || (i === 0 && n === SLIDES.length - 1);
          return (
            <div className="rep-showcase-slide" key={s.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.alt}
                width={1280}
                height={853}
                loading={n === 0 ? "eager" : "lazy"}
                decoding="async"
                style={{
                  opacity: on ? 1 : 0,
                  transform: on
                    ? "translateX(0)"
                    : `translateX(${behind ? -46 : 46}px)`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="rep-showcase-plates">
        {SLIDES.map((s, n) => (
          <button
            key={s.id}
            type="button"
            className={n === i ? "is-active" : ""}
            aria-pressed={n === i}
            onClick={() => go(n)}
          >
            <span className="rep-plate-dot" />
            {s.plate}
          </button>
        ))}
      </div>

      <div className="rep-showcase-caption-wrap">
        <span className="rep-showcase-caption" aria-live="polite">
          {SLIDES[i].title}
        </span>
      </div>
    </div>
  );
}
