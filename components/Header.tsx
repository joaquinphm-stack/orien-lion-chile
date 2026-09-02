import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavClient from "./NavClient";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  let nombre = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, nombre")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? "cliente";
    nombre = profile?.nombre ?? "";
  }

  return (
    <header className="site" id="site-header">
      <div className="nav container">
        <Link href="/" className="logo">
          <svg
            className="logo-mark"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="13" cy="13" r="12" stroke="white" strokeWidth="1" />
            <circle cx="13" cy="13" r="6.5" stroke="white" strokeWidth="1" />
            <circle cx="13" cy="13" r="1.4" fill="white" />
          </svg>
          ORIENT <span>LION</span>
        </Link>

        <NavClient
          isLogged={!!user}
          isAdmin={role === "admin"}
          nombre={nombre}
        />
      </div>
    </header>
  );
}
