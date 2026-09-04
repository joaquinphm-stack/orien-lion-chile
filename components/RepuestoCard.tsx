"use client";

import { useState } from "react";
import { formatCLP, storageImg, waLink, type Repuesto } from "@/lib/types";

function Placeholder() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />
    </svg>
  );
}

type Props = {
  repuesto: Repuesto;
  isAdmin?: boolean;
  busy?: boolean;
  onEdit?: () => void;
  onToggleDestacado?: () => void;
  onToggleActivo?: () => void;
};

export default function RepuestoCard({
  repuesto,
  isAdmin,
  busy,
  onEdit,
  onToggleDestacado,
  onToggleActivo,
}: Props) {
  const fotos = repuesto.imagenes ?? [];
  const [idx, setIdx] = useState(0);
  const activa = fotos[Math.min(idx, Math.max(fotos.length - 1, 0))];
  const waText = `Hola, quiero consultar por el repuesto: ${repuesto.nombre}`;
  const tieneVolt = repuesto.voltaje.length > 0;

  return (
    <article className={`repuesto-card${repuesto.activo ? "" : " is-hidden"}`}>
      {isAdmin && (
        <div className="card-admin-bar">
          <button type="button" onClick={onEdit} disabled={busy} title="Editar ficha">
            ✎
          </button>
          <button
            type="button"
            onClick={onToggleDestacado}
            disabled={busy}
            aria-pressed={repuesto.destacado}
            title={repuesto.destacado ? "Quitar de destacados" : "Destacar"}
          >
            {repuesto.destacado ? "★" : "☆"}
          </button>
          <button
            type="button"
            onClick={onToggleActivo}
            disabled={busy}
            aria-pressed={repuesto.activo}
            title={repuesto.activo ? "Ocultar en la web" : "Mostrar en la web"}
          >
            {repuesto.activo ? "👁" : "🚫"}
          </button>
        </div>
      )}

      <div className="repuesto-media">
        {activa ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="repuesto-img"
            src={storageImg(activa, 640)}
            alt={`${repuesto.nombre} — foto ${idx + 1}`}
            loading="lazy"
            decoding="async"
            width={640}
            height={480}
          />
        ) : (
          <div className="repuesto-media-empty">
            <Placeholder />
            <span>Foto en alta resolución</span>
          </div>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="repuesto-thumbs">
          {fotos.map((f, i) => (
            <button
              type="button"
              key={f}
              className={i === idx ? "is-active" : ""}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === idx}
              onClick={() => setIdx(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={storageImg(f, 120)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <div className="repuesto-body">
        <div className="repuesto-chips">
          {tieneVolt ? (
            repuesto.voltaje.map((v) => (
              <span className="chip chip-volt" key={v}>
                {v}
              </span>
            ))
          ) : (
            <span className="chip chip-univ">Compatibilidad universal</span>
          )}
        </div>

        {repuesto.subcategoria && (
          <p className="repuesto-sub">{repuesto.subcategoria}</p>
        )}
        <h3>{repuesto.nombre}</h3>
        {repuesto.descripcion && (
          <p className="repuesto-desc">{repuesto.descripcion}</p>
        )}

        {repuesto.specs.length > 0 && (
          <details className="repuesto-specs">
            <summary>Especificaciones</summary>
            <dl>
              {repuesto.specs.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </details>
        )}

        <div className="repuesto-price">
          {repuesto.precio == null ? (
            <span className="ask">Consultar precio</span>
          ) : (
            <>
              <span className="amount">{formatCLP(repuesto.precio)}</span>
              {repuesto.precio_nota && <span className="note">{repuesto.precio_nota}</span>}
            </>
          )}
        </div>

        <a
          className="btn btn-primary repuesto-wa"
          href={waLink(waText)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  );
}
