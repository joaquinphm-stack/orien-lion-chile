import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import RepuestoCard from "@/components/RepuestoCard";
import { waLink, REPUESTO_CATEGORIAS, type Repuesto } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Repuestos | Orient Lion Chile",
  description:
    "Repuestos para toritos eléctricos de carga Orient Lion: baterías y cargadores, motor y controlador, neumáticos y frenos, carrocería y transmisión. Cotiza por WhatsApp.",
};

const WA_GENERAL = "Hola, necesito un repuesto para mi torito eléctrico Orient Lion";

export default async function RepuestosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repuestos")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true });

  const repuestos = (data ?? []) as Repuesto[];
  const grupos = REPUESTO_CATEGORIAS.map((cat) => ({
    cat,
    items: repuestos.filter((r) => r.categoria === cat.id),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="section repuestos-intro">
      <div className="container">
        <div className="section-head">
          <div className="kicker">
            <span className="dot" />
            Postventa
          </div>
          <h1>Repuestos para tu torito eléctrico</h1>
          <p>
            Tenemos repuestos para toda la línea de toritos Orient Lion: batería,
            motor, neumáticos, frenos y carrocería. Escríbenos por WhatsApp con tu
            modelo y te cotizamos con el precio final puesto en tu comuna.
          </p>
          <div className="repuestos-intro-cta">
            <a
              className="btn btn-primary"
              href={waLink(WA_GENERAL)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar un repuesto
            </a>
          </div>
        </div>

        {grupos.length > 0 ? (
          grupos.map(({ cat, items }) => (
            <div className="repuesto-cat" key={cat.id}>
              <div className="repuesto-cat-head">
                <h2>{cat.nombre}</h2>
                <p>{cat.detalle}</p>
              </div>
              <div className="repuestos-grid">
                {items.map((r) => (
                  <RepuestoCard key={r.id} repuesto={r} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="repuestos-empty">
            <p>
              Estamos cargando el catálogo de repuestos. Mientras tanto,
              escríbenos por WhatsApp y te cotizamos cualquier repuesto que
              necesites.
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
        )}
      </div>
    </section>
  );
}
