"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Color, RepuestoCategoria, Spec } from "@/lib/types";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { supabase, user, isAdmin: profile?.role === "admin" };
}

export type ProductInput = {
  id: string;
  nombre: string;
  capacidad_kg: number;
  precio: number;
  precio_nota: string;
  specs: Spec[];
  colores: Color[];
  color_default: number;
  imagenes: string[];
  destacado: boolean;
  destacado_texto: string;
  orden: number;
  activo: boolean;
};

export async function saveProduct(input: ProductInput): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: "No autorizado." };

  const { id, ...fields } = input;
  const { error } = await supabase
    .from("products")
    .update(fields)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: "No autorizado." };

  const slug = input.id.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  if (!slug) return { ok: false, error: "El identificador no es válido." };

  const { error } = await supabase.from("products").insert({ ...input, id: slug });
  if (error) {
    return {
      ok: false,
      error: error.code === "23505" ? "Ya existe un producto con ese identificador." : error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: "No autorizado." };

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateProfileName(nombre: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autorizado." };

  const { error } = await supabase
    .from("profiles")
    .update({ nombre: nombre.trim() })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/perfil");
  revalidatePath("/");
  return { ok: true };
}

export type RepuestoInput = {
  id: string;
  nombre: string;
  categoria: RepuestoCategoria;
  descripcion: string;
  compatibilidad: string;
  imagenes: string[];
  orden: number;
  activo: boolean;
};

export async function saveRepuesto(input: RepuestoInput): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: "No autorizado." };

  const { id, ...fields } = input;
  const { error } = await supabase.from("repuestos").update(fields).eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/repuestos");
  revalidatePath("/admin");
  return { ok: true };
}

export async function createRepuesto(input: RepuestoInput): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: "No autorizado." };

  const slug = input.id.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  if (!slug) return { ok: false, error: "El identificador no es válido." };

  const { error } = await supabase
    .from("repuestos")
    .insert({ ...input, id: slug });
  if (error) {
    return {
      ok: false,
      error:
        error.code === "23505"
          ? "Ya existe un repuesto con ese identificador."
          : error.message,
    };
  }

  revalidatePath("/repuestos");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteRepuesto(id: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { ok: false, error: "No autorizado." };

  const { error } = await supabase.from("repuestos").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/repuestos");
  revalidatePath("/admin");
  return { ok: true };
}
