"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { waLink } from "@/lib/types";

type Props = {
  isLogged: boolean;
  isAdmin: boolean;
  nombre: string;
};

const SECTIONS = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#modelos", label: "Modelos" },
  { href: "/repuestos", label: "Repuestos" },
  { href: "/#testimonios", label: "Testimonios" },
  { href: "/#contacto", label: "Contacto" },
];

export default function NavClient({ isLogged, isAdmin, nombre }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Cierra el menú al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <ul className="nav-links">
        {SECTIONS.map((s) => (
          <li key={s.href}>
            <Link href={s.href}>{s.label}</Link>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        {isLogged ? (
          <>
            {isAdmin && <Link href="/admin">Admin</Link>}
            <Link href="/perfil">{nombre ? nombre.split(" ")[0] : "Perfil"}</Link>
            <button type="button" className="linklike" onClick={logout}>
              Salir
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Iniciar sesión</Link>
            <Link href="/registro">Crear cuenta</Link>
          </>
        )}
        <a
          className="nav-cta"
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cotizar
        </a>
      </div>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="mobile-menu">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} onClick={() => setOpen(false)}>
              {s.label}
            </Link>
          ))}
          <div className="mobile-menu-sep" />
          {isLogged ? (
            <>
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              )}
              <Link href="/perfil" onClick={() => setOpen(false)}>
                Mi perfil
              </Link>
              <button type="button" className="linklike" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                Iniciar sesión
              </Link>
              <Link href="/registro" onClick={() => setOpen(false)}>
                Crear cuenta
              </Link>
            </>
          )}
          <a
            className="nav-cta"
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
