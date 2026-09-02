export type Spec = { label: string; value: string };
export type Color = { nombre: string; hex: string; imagenes?: string[] };

export type Product = {
  id: string;
  nombre: string;
  capacidad_kg: number;
  precio: number;
  precio_nota: string;
  specs: Spec[];
  imagenes: string[];
  colores: Color[];
  destacado: boolean;
  destacado_texto: string;
  orden: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type RepuestoCategoria = "bateria" | "motor" | "neumatico" | "carroceria";

export type Repuesto = {
  id: string;
  nombre: string;
  categoria: RepuestoCategoria;
  descripcion: string;
  compatibilidad: string;
  imagenes: string[];
  orden: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export const REPUESTO_CATEGORIAS: {
  id: RepuestoCategoria;
  nombre: string;
  detalle: string;
}[] = [
  {
    id: "bateria",
    nombre: "Baterías y cargadores",
    detalle: "Baterías de litio y plomo-ácido, cargadores.",
  },
  {
    id: "motor",
    nombre: "Motor y controlador",
    detalle: "Motor, controlador, acelerador y tablero.",
  },
  {
    id: "neumatico",
    nombre: "Neumáticos y frenos",
    detalle: "Neumáticos, cámaras y componentes de freno.",
  },
  {
    id: "carroceria",
    nombre: "Carrocería y transmisión",
    detalle: "Tolva, pistón, cadena, luces y espejos.",
  },
];

export type Profile = {
  id: string;
  nombre: string;
  email: string;
  role: "cliente" | "admin";
  created_at: string;
};

export const WHATSAPP_NUMBER = "56999125871";

export function waLink(text?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function formatCLP(value: number) {
  return "$" + Math.round(value).toLocaleString("es-CL");
}
