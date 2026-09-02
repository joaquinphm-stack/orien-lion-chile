"use client";

import { useState } from "react";
import { waLink } from "@/lib/types";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nombre = String(fd.get("nombre") || "").trim();
    const telefono = String(fd.get("telefono") || "").trim();
    const modelo = String(fd.get("modelo") || "");
    const comuna = String(fd.get("comuna") || "").trim();
    const mensaje = String(fd.get("mensaje") || "").trim();

    if (!nombre || !telefono) {
      alert("Por favor completa tu nombre y teléfono.");
      return;
    }

    const texto =
      `Hola, soy ${nombre} (${telefono}).\n` +
      `Me interesa: ${modelo}.\n` +
      (comuna ? `Comuna de destino: ${comuna}.\n` : "") +
      (mensaje ? `Mensaje: ${mensaje}` : "");

    window.open(waLink(texto), "_blank", "noopener");
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <div className="form-card">
      {sent && (
        <div className="alert alert-ok">
          ✓ Abrimos WhatsApp con tu consulta. Si no se abrió, escríbenos directo al
          +56 9 9912 5871.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="nombre">Nombre completo</label>
          <input type="text" id="nombre" name="nombre" required placeholder="Tu nombre" />
        </div>

        <div className="form-cols">
          <div className="form-row">
            <label htmlFor="telefono">Teléfono</label>
            <input type="tel" id="telefono" name="telefono" required placeholder="+56 9 ..." />
          </div>
          <div className="form-row">
            <label htmlFor="modelo">Modelo de interés</label>
            <select id="modelo" name="modelo" defaultValue="Torito 500 kg">
              <option>Torito 500 kg</option>
              <option>Torito 800 kg</option>
              <option>Torito 1000 kg</option>
              <option>Repuestos</option>
              <option>Aún no sé, quiero asesoría</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="comuna">Comuna de destino</label>
          <input type="text" id="comuna" name="comuna" placeholder="Ej: Puente Alto, Santiago" />
        </div>

        <div className="form-row">
          <label htmlFor="mensaje">Mensaje (opcional)</label>
          <textarea id="mensaje" name="mensaje" placeholder="Cuéntanos para qué necesitas el torito" />
        </div>

        <button type="submit" className="btn form-submit">
          Enviar consulta por WhatsApp
        </button>
        <p className="form-note">
          Al enviar, se abre WhatsApp con tu consulta lista para mandar.
        </p>
      </form>
    </div>
  );
}
