import { waLink, type Repuesto, type RepuestoCategoria } from "@/lib/types";

function CategoriaGlyph({ categoria }: { categoria: RepuestoCategoria }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (categoria === "bateria") {
    return (
      <svg {...common}>
        <rect x="2.5" y="7" width="16" height="10" rx="1.5" />
        <path d="M18.5 10.5h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2" />
        <path d="M6.5 10v4M9.5 10v4" />
      </svg>
    );
  }
  if (categoria === "motor") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
      </svg>
    );
  }
  if (categoria === "neumatico") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M4 8.8V17l8 4 8-4V8.8" />
      <path d="M12 12.3 4 8.8M12 12.3l8-3.5M12 12.3V21" />
    </svg>
  );
}

export default function RepuestoCard({ repuesto }: { repuesto: Repuesto }) {
  const img = repuesto.imagenes?.[0];
  const waText = `Hola, quiero cotizar el repuesto: ${repuesto.nombre}`;

  return (
    <article className="repuesto-card">
      <div className="repuesto-media">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="repuesto-img"
            src={img}
            alt={`${repuesto.nombre} — repuesto Orient Lion`}
          />
        ) : (
          <div className="repuesto-media-empty">
            <CategoriaGlyph categoria={repuesto.categoria} />
          </div>
        )}
      </div>

      <div className="repuesto-body">
        <h3>{repuesto.nombre}</h3>
        {repuesto.descripcion && (
          <p className="repuesto-desc">{repuesto.descripcion}</p>
        )}
        {repuesto.compatibilidad && (
          <p className="repuesto-compat">
            <span className="dot" />
            {repuesto.compatibilidad}
          </p>
        )}
        <a
          className="btn btn-primary"
          href={waLink(waText)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cotizar por WhatsApp
        </a>
      </div>
    </article>
  );
}
