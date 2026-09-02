// Claves PÚBLICAS de Supabase.
// La "publishable key" (anon) está diseñada para vivir en el cliente y está
// protegida por Row Level Security en la base de datos, así que versionarla es
// seguro y evita tener que configurar variables de entorno en Vercel.
// La service_role key NUNCA se usa en este proyecto.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://jozqjwkutcqeiereobun.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_kJ0-xDQCcrXeR2PQZwemqQ_M6RsS4vW";

export const PRODUCT_IMAGES_BUCKET = "product-images";
