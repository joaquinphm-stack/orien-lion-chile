"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  REPUESTO_CATEGORIAS,
  slugify,
  storageImg,
  subAnchor,
  waLink,
  type Repuesto,
  type RepuestoCategoria,
  type Spec,
} from "@/lib/types";
import RepuestoCard from "@/components/RepuestoCard";
import RepuestosHeroShowcase from "@/components/repuestos/RepuestosHeroShowcase";
import WaGlyph from "@/components/WaGlyph";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_IMAGES_BUCKET } from "@/lib/supabase/config";
import {
  createRepuesto,
  saveRepuesto,
  setRepuestoFlags,
  saveTextoSitio,
  deleteRepuesto,
  type RepuestoInput,
} from "@/app/actions";

const VOLTAJES = ["60V", "72V"];

/** Sube un archivo al bucket de Storage con el JWT del admin y devuelve su URL pública. */
async function uploadImage(folder: string, file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
}
const ANIOS = Array.from({ length: 8 }, (_, i) => String(new Date().getFullYear() - i));
const WA_GENERAL =
  "Hola, necesito ayuda para identificar un repuesto de mi torito eléctrico Orient Lion";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

type Props = {
  repuestos: Repuesto[];
  textos: Record<string, string>;
  isAdmin: boolean;
};

export default function RepuestosClient({ repuestos, textos, isAdmin }: Props) {
  const [rows, setRows] = useState<Repuesto[]>(repuestos);
  const [txt, setTxt] = useState<Record<string, string>>(textos);
  const [msg, setMsg] = useState("");

  const [q, setQ] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [volt, setVolt] = useState("");

  const [drawer, setDrawer] = useState<
    | { mode: "edit"; row: Repuesto }
    | { mode: "new"; categoria: RepuestoCategoria; subcategoria: string }
    | null
  >(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => setRows(repuestos), [repuestos]);
  useEffect(() => setTxt(textos), [textos]);

  function flash(m: string) {
    setMsg(m);
    window.clearTimeout((flash as unknown as { t?: number }).t);
    (flash as unknown as { t?: number }).t = window.setTimeout(() => setMsg(""), 2600);
  }

  // Scroll a la subcategoría / categoría del hash tras montar
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h) document.getElementById(h)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const modelos = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.modelos_compatibles.forEach((m) => set.add(m)));
    return [...set].sort((a, b) => a.localeCompare(b, "es"));
  }, [rows]);

  const filtroActivo = !!(q.trim() || modelo || anio || volt);

  function matches(r: Repuesto) {
    if (q.trim()) {
      const hay = norm(
        [r.nombre, r.subcategoria, r.descripcion, r.compatibilidad].join(" "),
      );
      if (!norm(q).split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    if (modelo && r.modelos_compatibles.length && !r.modelos_compatibles.includes(modelo))
      return false;
    if (volt && r.voltaje.length && !r.voltaje.includes(volt)) return false;
    if (anio) {
      const y = Number(anio);
      if (r.anio_desde != null && y < r.anio_desde) return false;
      if (r.anio_hasta != null && y > r.anio_hasta) return false;
    }
    return true;
  }

  const visibles = rows.filter((r) => isAdmin || r.activo);
  const filtradas = visibles.filter(matches);
  const destacados = visibles.filter((r) => r.destacado);

  const grupos = REPUESTO_CATEGORIAS.map((cat) => {
    const items = filtradas.filter((r) => r.categoria === cat.id);
    const orden = cat.subcategorias;
    const subs = [...new Set(items.map((r) => r.subcategoria || "Otros"))].sort(
      (a, b) => {
        const ia = orden.indexOf(a);
        const ib = orden.indexOf(b);
        if (ia !== -1 || ib !== -1)
          return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        return a.localeCompare(b, "es");
      },
    );
    return { cat, items, subs };
  });

  // ---- acciones admin ----
  async function toggleFlag(r: Repuesto, flag: "destacado" | "activo") {
    setBusyId(r.id);
    const next = !r[flag];
    const res = await setRepuestoFlags(r.id, { [flag]: next });
    setBusyId(null);
    if (!res.ok) return flash(res.error);
    setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, [flag]: next } : x)));
    flash("Guardado");
  }

  function resetFiltros() {
    setQ("");
    setModelo("");
    setAnio("");
    setVolt("");
  }

  return (
    <div className="rep">
      {/* ---------------- HERO ---------------- */}
      <section className="rep-hero">
        <span aria-hidden="true" className="rep-hero-glow" />
        <div className="container rep-hero-in">
          <div className="rep-hero-copy">
            <div className="rep-eyebrow">
              <span className="dot" />
              Repuestos para toritos eléctricos · Chile
            </div>
            <h1 className="rep-hero-h1">
              Tu torito no se queda <span className="faint">parado</span> por un
              repuesto
            </h1>
            <p className="rep-hero-lead">
              Controladores, aceleradores y baterías para triciclos eléctricos de
              carga. Nos escribes la pieza que necesitas, te confirmamos stock y
              te la despachamos a tu comuna.
            </p>
            <div className="rep-hero-ctas">
              <a className="btn btn-ghost" href="#catalogo">
                Ver todos los repuestos
              </a>
              <a
                className="btn btn-primary"
                href={waLink(WA_GENERAL)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WaGlyph />
                <span>
                  Cotizar<span className="rep-wa-detail"> repuesto</span> por
                  WhatsApp
                </span>
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <span className="num">3</span>
                <span className="label">Familias de repuestos en stock</span>
              </div>
              <div>
                <span className="num">24h</span>
                <span className="label">Despacho mismo día o al siguiente</span>
              </div>
              <div>
                <span className="num">$0</span>
                <span className="label">Se paga al recibir, no antes</span>
              </div>
            </div>
          </div>

          <div className="rep-hero-media">
            <RepuestosHeroShowcase />
          </div>
        </div>
      </section>

      {/* ------------- BUSCADOR ------------- */}
      <div className="container rep-buscador" id="buscador">
        <div className="rep-searchbar">
          <input
            type="search"
            className="rep-q"
            placeholder="Buscar repuesto: batería, acelerador, balatas…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar repuesto"
          />
          <div className="rep-facets">
            <select value={modelo} onChange={(e) => setModelo(e.target.value)} aria-label="Modelo">
              <option value="">Todos los modelos</option>
              {modelos.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select value={anio} onChange={(e) => setAnio(e.target.value)} aria-label="Año">
              <option value="">Cualquier año</option>
              {ANIOS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select value={volt} onChange={(e) => setVolt(e.target.value)} aria-label="Voltaje">
              <option value="">60V / 72V</option>
              {VOLTAJES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          {filtroActivo && (
            <button type="button" className="rep-clear" onClick={resetFiltros}>
              Limpiar ({filtradas.length})
            </button>
          )}
        </div>
      </div>

      {/* ------------- CATEGORÍAS MADRE ------------- */}
      {!filtroActivo && (
        <section className="container rep-cats">
          {REPUESTO_CATEGORIAS.map((cat) => (
            <a className="rep-cat-card" href={`#cat-${cat.id}`} key={cat.id}>
              <CatIcon id={cat.id} />
              <Editable
                as="h3"
                k={`repuestos.cat.${cat.id}.titulo`}
                fallback={cat.nombre}
                txt={txt}
                setTxt={setTxt}
                isAdmin={isAdmin}
                flash={flash}
              />
              <Editable
                as="p"
                k={`repuestos.cat.${cat.id}.desc`}
                fallback={cat.detalle}
                txt={txt}
                setTxt={setTxt}
                isAdmin={isAdmin}
                flash={flash}
              />
            </a>
          ))}
        </section>
      )}

      {/* ------------- LOS MÁS BUSCADOS ------------- */}
      {!filtroActivo && destacados.length > 0 && (
        <section className="rep-section rep-section-alt">
          <div className="container">
            <Editable
              as="h2"
              k="repuestos.destacados.titulo"
              txt={txt}
              setTxt={setTxt}
              isAdmin={isAdmin}
              flash={flash}
            />
            <Editable
              as="p"
              className="rep-section-lead"
              k="repuestos.destacados.bajada"
              txt={txt}
              setTxt={setTxt}
              isAdmin={isAdmin}
              flash={flash}
            />
            <div className="rep-grid">
              {destacados.map((r) => (
                <RepuestoCard
                  key={r.id}
                  repuesto={r}
                  isAdmin={isAdmin}
                  busy={busyId === r.id}
                  onEdit={() => setDrawer({ mode: "edit", row: r })}
                  onToggleDestacado={() => toggleFlag(r, "destacado")}
                  onToggleActivo={() => toggleFlag(r, "activo")}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------- CATÁLOGO COMPLETO ------------- */}
      <section className="rep-section" id="catalogo">
        <div className="container">
          {filtroActivo && (
            <div className="rep-results-head">
              <h2>
                {filtradas.length} resultado{filtradas.length === 1 ? "" : "s"}
              </h2>
              <button type="button" className="rep-clear" onClick={resetFiltros}>
                Limpiar filtros
              </button>
            </div>
          )}

          {filtradas.length === 0 ? (
            <div className="rep-empty">
              <p>
                No encontramos repuestos con esos filtros. Escríbenos por WhatsApp
                con tu modelo y te ayudamos a identificar la pieza.
              </p>
              <a
                className="btn btn-primary"
                href={waLink(WA_GENERAL)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escribir por WhatsApp
              </a>
            </div>
          ) : (
            grupos.map(({ cat, items, subs }) =>
              items.length === 0 && !isAdmin ? null : (
                <div className="rep-cat-block" id={`cat-${cat.id}`} key={cat.id}>
                  <div className="rep-cat-block-head">
                    <h2>{txt[`repuestos.cat.${cat.id}.titulo`] || cat.nombre}</h2>
                    {isAdmin && (
                      <button
                        type="button"
                        className="rep-add"
                        onClick={() =>
                          setDrawer({
                            mode: "new",
                            categoria: cat.id,
                            subcategoria: cat.subcategorias[0] ?? "",
                          })
                        }
                      >
                        + Agregar repuesto
                      </button>
                    )}
                  </div>

                  {subs.map((sub) => (
                    <div
                      className="rep-subcat"
                      id={subAnchor(cat.id, sub)}
                      key={sub}
                    >
                      <h3 className="rep-subcat-head">{sub}</h3>
                      <div className="rep-grid">
                        {items
                          .filter((r) => (r.subcategoria || "Otros") === sub)
                          .map((r) => (
                            <RepuestoCard
                              key={r.id}
                              repuesto={r}
                              isAdmin={isAdmin}
                              busy={busyId === r.id}
                              onEdit={() => setDrawer({ mode: "edit", row: r })}
                              onToggleDestacado={() => toggleFlag(r, "destacado")}
                              onToggleActivo={() => toggleFlag(r, "activo")}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            )
          )}
        </div>
      </section>

      {drawer && (
        <Drawer
          key={drawer.mode === "edit" ? drawer.row.id : `new-${drawer.categoria}`}
          state={drawer}
          onClose={() => setDrawer(null)}
          onSaved={(row, mode) => {
            setRows((rs) =>
              mode === "new"
                ? [...rs, row]
                : rs.map((x) => (x.id === row.id ? row : x)),
            );
            setDrawer(null);
            flash("Guardado");
          }}
          onDeleted={(id) => {
            setRows((rs) => rs.filter((x) => x.id !== id));
            setDrawer(null);
            flash("Repuesto eliminado");
          }}
          flash={flash}
        />
      )}

      {msg && <div className="rep-toast">{msg}</div>}
    </div>
  );
}

/* ---------------- Texto editable ---------------- */
function Editable({
  as,
  k,
  fallback = "",
  className,
  txt,
  setTxt,
  isAdmin,
  flash,
}: {
  as: "h1" | "h2" | "h3" | "p";
  k: string;
  fallback?: string;
  className?: string;
  txt: Record<string, string>;
  setTxt: (fn: (t: Record<string, string>) => Record<string, string>) => void;
  isAdmin: boolean;
  flash: (m: string) => void;
}) {
  const Tag = as;
  const value = txt[k] ?? fallback;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [pending, start] = useTransition();

  if (!isAdmin) return <Tag className={className}>{value}</Tag>;

  if (editing) {
    return (
      <div className="rep-edit-text">
        <textarea
          value={draft}
          rows={as === "p" ? 3 : 2}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
        />
        <div className="rep-edit-text-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await saveTextoSitio(k, draft.trim());
                if (!res.ok) return flash(res.error);
                setTxt((t) => ({ ...t, [k]: draft.trim() }));
                setEditing(false);
                flash("Texto guardado");
              })
            }
          >
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setDraft(value);
              setEditing(false);
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      className={`${className ?? ""} rep-editable`.trim()}
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      title="Clic para editar"
    >
      {value}
      <span className="rep-editable-pen" aria-hidden="true">
        ✎
      </span>
    </Tag>
  );
}

/* ---------------- Drawer de ficha ---------------- */
function Drawer({
  state,
  onClose,
  onSaved,
  onDeleted,
  flash,
}: {
  state:
    | { mode: "edit"; row: Repuesto }
    | { mode: "new"; categoria: RepuestoCategoria; subcategoria: string };
  onClose: () => void;
  onSaved: (row: Repuesto, mode: "edit" | "new") => void;
  onDeleted: (id: string) => void;
  flash: (m: string) => void;
}) {
  const base: Repuesto =
    state.mode === "edit"
      ? state.row
      : {
          id: "",
          nombre: "",
          categoria: state.categoria,
          subcategoria: state.subcategoria,
          descripcion: "",
          compatibilidad: "Compatible con toda la línea de toritos.",
          specs: [],
          precio: null,
          precio_nota: "Precio con IVA incluido",
          destacado: false,
          voltaje: [],
          modelos_compatibles: [],
          anio_desde: null,
          anio_hasta: null,
          imagenes: [],
          orden: 0,
          activo: true,
          created_at: "",
          updated_at: "",
        };

  const [f, setF] = useState<Repuesto>(base);
  const [slug, setSlug] = useState(state.mode === "new" ? "" : base.id);
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof Repuesto>(key: K, v: Repuesto[K]) =>
    setF((p) => ({ ...p, [key]: v }));
  const setSpec = (i: number, key: keyof Spec, v: string) =>
    set(
      "specs",
      f.specs.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)),
    );

  async function onUploadFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    const folder = `repuestos/${
      (state.mode === "new" ? slug || slugify(f.nombre) : f.id) || "nuevo"
    }`;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) urls.push(await uploadImage(folder, file));
      setF((p) => ({ ...p, imagenes: [...p.imagenes, ...urls] }));
      flash("Foto subida — recuerda guardar la ficha");
    } catch (err) {
      flash("No se pudo subir la foto: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const cat = REPUESTO_CATEGORIAS.find((c) => c.id === f.categoria);

  function submit() {
    const input: RepuestoInput = {
      id: state.mode === "new" ? slug || slugify(f.nombre) : f.id,
      nombre: f.nombre.trim(),
      categoria: f.categoria,
      subcategoria: f.subcategoria.trim(),
      descripcion: f.descripcion.trim(),
      compatibilidad: f.compatibilidad.trim(),
      specs: f.specs
        .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
        .filter((s) => s.label || s.value),
      precio: f.precio,
      precio_nota: f.precio_nota.trim(),
      destacado: f.destacado,
      voltaje: f.voltaje,
      modelos_compatibles: f.modelos_compatibles,
      anio_desde: f.anio_desde,
      anio_hasta: f.anio_hasta,
      imagenes: f.imagenes,
      orden: f.orden,
      activo: f.activo,
    };
    if (!input.nombre) return flash("Falta el nombre.");
    start(async () => {
      const res =
        state.mode === "new"
          ? await createRepuesto(input)
          : await saveRepuesto(input);
      if (!res.ok) return flash(res.error);
      onSaved({ ...f, ...input, id: input.id }, state.mode);
    });
  }

  function remove() {
    if (state.mode !== "edit") return;
    if (!window.confirm(`¿Eliminar "${f.nombre}"? No se puede deshacer.`)) return;
    start(async () => {
      const res = await deleteRepuesto(f.id);
      if (!res.ok) return flash(res.error);
      onDeleted(f.id);
    });
  }

  return (
    <div className="rep-drawer-wrap" role="dialog" aria-modal="true">
      <div className="rep-drawer-scrim" onClick={onClose} />
      <div className="rep-drawer">
        <div className="rep-drawer-head">
          <strong>{state.mode === "new" ? "Nuevo repuesto" : "Editar repuesto"}</strong>
          <button type="button" className="rep-drawer-x" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="rep-drawer-body">
          <label>
            Nombre
            <input value={f.nombre} onChange={(e) => set("nombre", e.target.value)} />
          </label>

          {state.mode === "new" && (
            <label>
              Identificador (URL)
              <input
                value={slug}
                placeholder="se genera del nombre"
                onChange={(e) => setSlug(e.target.value)}
              />
            </label>
          )}

          <div className="rep-drawer-row">
            <label>
              Categoría
              <select
                value={f.categoria}
                onChange={(e) => set("categoria", e.target.value as RepuestoCategoria)}
              >
                {REPUESTO_CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Subcategoría
              <input
                list="subcats"
                value={f.subcategoria}
                onChange={(e) => set("subcategoria", e.target.value)}
              />
              <datalist id="subcats">
                {(cat?.subcategorias ?? []).map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </label>
          </div>

          <label>
            Descripción
            <textarea
              rows={3}
              value={f.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
            />
          </label>

          <div className="rep-drawer-specs">
            <span className="rep-drawer-specs-title">Especificaciones</span>
            {f.specs.map((s, i) => (
              <div className="rep-spec-row" key={i}>
                <input
                  placeholder="Etiqueta (ej: Peso)"
                  value={s.label}
                  onChange={(e) => setSpec(i, "label", e.target.value)}
                />
                <input
                  placeholder="Valor (ej: 4 kg)"
                  value={s.value}
                  onChange={(e) => setSpec(i, "value", e.target.value)}
                />
                <button
                  type="button"
                  className="rep-spec-x"
                  aria-label="Quitar"
                  onClick={() =>
                    set("specs", f.specs.filter((_, idx) => idx !== i))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => set("specs", [...f.specs, { label: "", value: "" }])}
            >
              + Agregar especificación
            </button>
          </div>

          <div className="rep-drawer-row">
            <label>
              Precio (CLP, vacío = “Consultar precio”)
              <input
                type="number"
                min={0}
                value={f.precio ?? ""}
                onChange={(e) =>
                  set("precio", e.target.value === "" ? null : Number(e.target.value))
                }
              />
            </label>
            <label>
              Nota de precio
              <input
                value={f.precio_nota}
                onChange={(e) => set("precio_nota", e.target.value)}
              />
            </label>
          </div>

          <fieldset className="rep-drawer-checks">
            <legend>Voltaje</legend>
            {VOLTAJES.map((v) => (
              <label key={v} className="rep-check">
                <input
                  type="checkbox"
                  checked={f.voltaje.includes(v)}
                  onChange={(e) =>
                    set(
                      "voltaje",
                      e.target.checked
                        ? [...f.voltaje, v]
                        : f.voltaje.filter((x) => x !== v),
                    )
                  }
                />
                {v}
              </label>
            ))}
          </fieldset>

          <label>
            Modelos compatibles (separados por coma; vacío = universal)
            <input
              value={f.modelos_compatibles.join(", ")}
              onChange={(e) =>
                set(
                  "modelos_compatibles",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </label>

          <div className="rep-drawer-row">
            <label>
              Año desde
              <input
                type="number"
                value={f.anio_desde ?? ""}
                onChange={(e) =>
                  set("anio_desde", e.target.value === "" ? null : Number(e.target.value))
                }
              />
            </label>
            <label>
              Año hasta
              <input
                type="number"
                value={f.anio_hasta ?? ""}
                onChange={(e) =>
                  set("anio_hasta", e.target.value === "" ? null : Number(e.target.value))
                }
              />
            </label>
          </div>

          <div className="rep-drawer-specs">
            <span className="rep-drawer-specs-title">
              Fotos {f.imagenes.length > 0 && `(${f.imagenes.length})`}
            </span>
            {f.imagenes.length > 0 && (
              <div className="rep-fotos">
                {f.imagenes.map((url, i) => (
                  <div className="rep-foto" key={url}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={storageImg(url, 160)} alt={`Foto ${i + 1}`} loading="lazy" />
                    {i === 0 ? (
                      <span className="rep-foto-tag">Principal</span>
                    ) : (
                      <button
                        type="button"
                        className="rep-foto-main"
                        title="Hacer principal"
                        onClick={() =>
                          set("imagenes", [
                            url,
                            ...f.imagenes.filter((u) => u !== url),
                          ])
                        }
                      >
                        ★
                      </button>
                    )}
                    <button
                      type="button"
                      className="rep-foto-x"
                      aria-label="Quitar foto"
                      onClick={() =>
                        set("imagenes", f.imagenes.filter((u) => u !== url))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="rep-foto-upload">
              {uploading ? "Subiendo…" : "＋ Subir fotos"}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={onUploadFotos}
              />
            </label>
          </div>

          <div className="rep-drawer-row">
            <label className="rep-check">
              <input
                type="checkbox"
                checked={f.destacado}
                onChange={(e) => set("destacado", e.target.checked)}
              />
              Destacado (“Los más buscados”)
            </label>
            <label className="rep-check">
              <input
                type="checkbox"
                checked={f.activo}
                onChange={(e) => set("activo", e.target.checked)}
              />
              Visible en la web
            </label>
          </div>
        </div>

        <div className="rep-drawer-foot">
          {state.mode === "edit" && (
            <button
              type="button"
              className="btn btn-ghost btn-danger"
              disabled={pending}
              onClick={remove}
            >
              Eliminar
            </button>
          )}
          <span className="rep-drawer-foot-sp" />
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={pending}
            onClick={submit}
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Iconos de categoría ---------------- */
function CatIcon({ id }: { id: RepuestoCategoria }): ReactNode {
  const p = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (id === "sistema-electrico")
    return (
      <svg {...p}>
        <path d="M13 2 4.5 13.5H12l-1 8.5L19.5 10H12l1-8Z" />
      </svg>
    );
  if (id === "chasis")
    return (
      <svg {...p}>
        <circle cx="6" cy="17" r="3" />
        <circle cx="18" cy="17" r="3" />
        <path d="M9 17h6M6 14V9h5l4 5M11 9l2-4h3" />
      </svg>
    );
  if (id === "frenos")
    return (
      <svg {...p}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M3 13l2-6h11l3 4h2v4M3 13v3h2M19 15v1h2v-4M7 16h8" />
      <circle cx="7.5" cy="17.5" r="1.6" />
      <circle cx="16.5" cy="17.5" r="1.6" />
    </svg>
  );
}
