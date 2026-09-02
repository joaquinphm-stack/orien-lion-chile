import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Product, Repuesto } from "@/lib/types";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const [{ data: productData }, { data: repuestoData }] = await Promise.all([
    supabase.from("products").select("*").order("orden", { ascending: true }),
    supabase.from("repuestos").select("*").order("orden", { ascending: true }),
  ]);

  const products = (productData ?? []) as Product[];
  const repuestos = (repuestoData ?? []) as Repuesto[];

  return (
    <div className="page-wrap">
      <h1>Panel de administración</h1>
      <p className="sub">
        Edita precios, características y fotos de los productos y repuestos, o
        agrega uno nuevo.
      </p>
      <AdminPanel initialProducts={products} initialRepuestos={repuestos} />
    </div>
  );
}
