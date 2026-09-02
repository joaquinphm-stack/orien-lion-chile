import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";
import { waLink, type Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const HERO_IMG =
  "https://jozqjwkutcqeiereobun.supabase.co/storage/v1/object/public/product-images/site/hero-torito.png";

const TESTIMONIOS = [
  {
    stars: "★★★★★",
    quote:
      "Lo pedí un lunes y el martes ya estaba repartiendo pedidos con el torito de 500 kilos. Pagué al recibirlo, tal como me dijeron.",
    ini: "RM",
    name: "Roberto Muñoz",
    role: "Feriante, Santiago",
  },
  {
    stars: "★★★★★",
    quote:
      "Cambié la camioneta a bencina por el torito de 800 kilos y el ahorro se nota cada semana. La tolva es más grande de lo que pensé.",
    ini: "CV",
    name: "Carolina Vidal",
    role: "Dueña de ferretería",
  },
  {
    stars: "★★★★★",
    quote:
      "Necesitaba mover materiales de construcción todos los días. El de 1000 kilos me resolvió el problema y llegó con factura, sin líos.",
    ini: "JP",
    name: "Jorge Paredes",
    role: "Maestro constructor",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true });

  const products = (data ?? []) as Product[];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span className="dot" />
              Toritos eléctricos de carga · Chile
            </div>
            <h1>
              Carga hasta <span className="faint">1000 kilos</span> sin gastar un
              peso en bencina
            </h1>
            <p className="lead">
              Triciclos de carga 100% eléctricos para feriantes, repartidores y
              pequeños negocios. Se despachan a domicilio y los pagas al
              recibirlos.
            </p>

            <div className="hero-ctas">
              <a
                className="btn btn-primary"
                href={waLink("Hola, quiero cotizar un torito eléctrico Orient Lion")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Cotizar por WhatsApp
              </a>
              <a className="btn btn-ghost" href="#modelos">
                Ver modelos y precios
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <span className="num">{products.length || 3}</span>
                <span className="label">Capacidades disponibles</span>
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

          <div className="hero-plate">
            <div className="plate-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hero-photo"
                src={HERO_IMG}
                alt="Torito eléctrico de carga Orient Lion, hasta 1000 kg"
                width={1050}
                height={589}
              />
            </div>
            <div className="plate-caption">
              <span className="dot" />
              Hasta 1000 kg de carga
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* SERVICIOS */}
      <section className="section" id="servicios">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span className="dot" />
              Cómo trabajamos
            </div>
            <h2>Comprar un torito eléctrico, sin vueltas</h2>
            <p>
              De la cotización a tu puerta, todo el proceso está pensado para que
              no adelantes ni un peso hasta tener el vehículo en tus manos.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="icon-tile">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="12" height="9" />
                  <path d="M14 10h4l3.5 3.5V16H14" />
                  <circle cx="7" cy="18.5" r="2" />
                  <circle cx="17" cy="18.5" r="2" />
                </svg>
              </div>
              <h3>Despacho a domicilio</h3>
              <p>
                Coordinamos por WhatsApp y el torito llega el mismo día o al día
                siguiente, según tu comuna.
              </p>
            </div>

            <div className="service-card">
              <div className="icon-tile">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="5" width="19" height="13" rx="1.5" />
                  <path d="M2.5 9.5h19" />
                  <circle cx="7" cy="13.5" r="1.3" />
                </svg>
              </div>
              <h3>Pago contra entrega</h3>
              <p>
                Pagas en efectivo cuando lo recibes en tu domicilio. El flete
                varía según la localidad de destino.
              </p>
            </div>

            <div className="service-card">
              <div className="icon-tile">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12v18l-6-3-6 3V3z" />
                  <path d="M9 9h6M9 12h6" />
                </svg>
              </div>
              <h3>Factura incluida</h3>
              <p>
                Toda compra se entrega con factura, con precio final IVA incluido,
                sin sorpresas.
              </p>
            </div>

            <div className="service-card">
              <div className="icon-tile">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l8 3.5v5c0 5.2-3.4 8.7-8 10.5-4.6-1.8-8-5.3-8-10.5v-5L12 2z" />
                  <path d="M8.5 12l2.3 2.3 4.7-5" />
                </svg>
              </div>
              <h3>Asesoría por WhatsApp</h3>
              <p>
                Te ayudamos a elegir el modelo según tu carga habitual antes de
                que compres nada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODELOS */}
      <section className="section section-alt" id="modelos">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span className="dot" />
              Catálogo
            </div>
            <h2>Elige tu capacidad de carga</h2>
            <p>
              Cada torito eléctrico está pensado para un volumen de trabajo
              distinto. Precios con IVA incluido.
            </p>
          </div>

          <div className="models-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="section" id="testimonios">
        <div className="container">
          <div className="section-head">
            <div className="kicker">
              <span className="dot" />
              Clientes
            </div>
            <h2>Lo que dicen quienes ya cargan con Orient Lion</h2>
            <p>Comentarios de compradores de distintos rubros.</p>
          </div>

          <div className="testi-grid">
            {TESTIMONIOS.map((t) => (
              <div className="testi-card" key={t.name}>
                <div className="testi-stars">{t.stars}</div>
                <p className="testi-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testi-person">
                  <div className="testi-avatar">{t.ini}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* CONTACTO */}
      <section className="section section-alt" id="contacto">
        <div className="container contact-grid">
          <div className="contact-info">
            <div className="kicker" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-dim)", fontWeight: 600, fontSize: "12.5px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
              Contacto
            </div>
            <h2>Cotiza tu torito eléctrico</h2>
            <p>
              Completa el formulario o escríbenos directo por WhatsApp. Te
              respondemos con el precio final, incluido el flete a tu comuna.
            </p>

            <div className="contact-detail">
              <span className="dot" />
              <div>
                <strong>WhatsApp</strong>
                <span>+56 9 9912 5871</span>
              </div>
            </div>
            <div className="contact-detail">
              <span className="dot" />
              <div>
                <strong>Zona de despacho</strong>
                <span>Todo Chile. El valor del flete varía según la localidad</span>
              </div>
            </div>
            <div className="contact-detail">
              <span className="dot" />
              <div>
                <strong>Forma de pago</strong>
                <span>Efectivo, contra entrega en tu domicilio</span>
              </div>
            </div>

            <a
              className="btn btn-primary"
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribir por WhatsApp ahora
            </a>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
