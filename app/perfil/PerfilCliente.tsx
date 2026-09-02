"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateProfileName } from "@/app/actions";

export default function PerfilCliente({
  initialNombre,
}: {
  initialNombre: string;
}) {
  const router = useRouter();

  const [nombre, setNombre] = useState(initialNombre);
  const [nombreMsg, setNombreMsg] = useState<string | null>(null);
  const [savingNombre, setSavingNombre] = useState(false);

  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [passMsg, setPassMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [savingPass, setSavingPass] = useState(false);

  async function saveNombre(e: React.FormEvent) {
    e.preventDefault();
    setSavingNombre(true);
    setNombreMsg(null);
    const res = await updateProfileName(nombre);
    setSavingNombre(false);
    if (res.ok) {
      setNombreMsg("Nombre actualizado.");
      router.refresh();
    } else {
      setNombreMsg(res.error);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassMsg(null);

    if (pass.length < 6) {
      setPassMsg({ ok: false, text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (pass !== pass2) {
      setPassMsg({ ok: false, text: "Las contraseñas no coinciden." });
      return;
    }

    setSavingPass(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pass });
    setSavingPass(false);

    if (error) {
      setPassMsg({ ok: false, text: "No se pudo cambiar la contraseña." });
      return;
    }
    setPass("");
    setPass2("");
    setPassMsg({ ok: true, text: "Contraseña actualizada." });
  }

  return (
    <div className="stack" style={{ gap: 40 }}>
      <section>
        <h2 style={{ fontSize: 18, marginBottom: 14 }}>Editar nombre</h2>
        {nombreMsg && (
          <div className="alert alert-ok" style={{ marginBottom: 14 }}>
            {nombreMsg}
          </div>
        )}
        <form onSubmit={saveNombre} className="inline">
          <input
            className="admin-field"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--white)",
              padding: "10px 12px",
              minWidth: 260,
            }}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
          <button className="btn btn-light btn-sm" disabled={savingNombre}>
            {savingNombre ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: 14 }}>Cambiar contraseña</h2>
        {passMsg && (
          <div
            className={"alert " + (passMsg.ok ? "alert-ok" : "alert-err")}
            style={{ marginBottom: 14 }}
          >
            {passMsg.text}
          </div>
        )}
        <form onSubmit={changePassword} className="stack" style={{ maxWidth: 360 }}>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Nueva contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--white)",
              padding: "10px 12px",
            }}
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Repite la contraseña"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--white)",
              padding: "10px 12px",
            }}
          />
          <button className="btn btn-light btn-sm" disabled={savingPass}>
            {savingPass ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </form>
      </section>
    </div>
  );
}
