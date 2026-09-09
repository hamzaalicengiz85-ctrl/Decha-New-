"use client";

import { AlertCircle, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

import type { Service } from "@decha/content";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

type Props = {
  services: Service[];
  email: string;
  formEndpoint: string;
};

type Errors = Partial<Record<"name" | "email" | "service", string>>;

const fieldClass =
  "w-full min-h-13 rounded-t-lg border-0 border-b border-white/18 bg-white/[0.03] px-4 py-3 " +
  "text-bone outline-none transition-[border-color,background-color,box-shadow] duration-300 " +
  "placeholder:text-muted hover:bg-white/[0.05] " +
  "focus:border-accent-soft focus:bg-white/[0.06] focus:shadow-[0_2px_0_0_var(--color-accent-soft)]";

const labelClass = "block text-sm font-medium text-bone-dim";

/**
 * İletişim formu.
 *
 * Doğrulama kuralları: ad en az 2 karakter, geçerli e-posta, hizmet
 * listesi doluysa hizmet seçimi. Hatalar hem alan altında hem de
 * odaklanabilir bir özet kutusunda duyurulur.
 */
export function ContactForm({ services, email, formEndpoint }: Props) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ text: string; kind: "ok" | "error" | "" }>({
    text: "",
    kind: "",
  });
  const [busy, setBusy] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const canSend = formEndpoint !== "" || email !== "";

  function validate(data: { name: string; email: string; service: string }): Errors {
    const next: Errors = {};
    if (data.name.trim().length < 2) next.name = "Adınızı yazın (en az 2 karakter).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()))
      next.email = "Geçerli bir e-posta adresi yazın.";
    if (services.length > 0 && data.service === "")
      next.service = "İlgilendiğiniz hizmeti seçin.";
    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      service: String(formData.get("service") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const found = validate(data);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus({ text: "", kind: "" });
      // Odağı özete taşı: klavye ve ekran okuyucu kullanıcıları hatayı bulsun
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setBusy(true);
    setStatus({ text: "Gönderiliyor…", kind: "" });

    if (formEndpoint !== "") {
      try {
        const response = await fetch(formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(String(response.status));
        form.reset();
        setStatus({ text: "Teşekkürler, mesajınız bize ulaştı.", kind: "ok" });
      } catch {
        setStatus({
          text: `Mesaj gönderilemedi. Lütfen tekrar deneyin${email ? ` veya ${email} adresine yazın` : ""}.`,
          kind: "error",
        });
      } finally {
        setBusy(false);
      }
      return;
    }

    // Uç nokta tanımlı değilse ziyaretçinin e-posta uygulamasını hazır bir
    // mesajla açıyoruz; hiçbir şey "gönderildi" gibi gösterilmiyor.
    const subject = `Yeni proje talebi${data.service ? ` — ${data.service}` : ""}`;
    const body = [
      `Ad: ${data.name}`,
      `E-posta: ${data.email}`,
      data.service ? `Hizmet: ${data.service}` : "",
      "",
      data.message,
    ]
      .filter(Boolean)
      .join("\n");

    setStatus({
      text: `E-posta uygulamanız açılıyor. Açılmazsa doğrudan ${email} adresine yazabilirsiniz.`,
      kind: "ok",
    });
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setBusy(false);
  }

  if (!canSend) {
    return (
      <div className="rounded-card border border-dashed border-white/12 bg-white/[0.015] p-8">
        <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-accent-soft/70">
          İletişim formu
        </span>
        <p className="mt-2 max-w-md text-sm text-muted">
          Form, yönetim panelinde bir e-posta adresi ya da form uç noktası
          girildiğinde etkinleşir.
        </p>
      </div>
    );
  }

  const errorList = Object.entries(errors) as [keyof Errors, string][];

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="hairline rounded-card border border-white/8 bg-ink-raised/70 p-6 md:p-8"
    >
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
          className="mb-6 rounded-lg border border-danger/35 bg-danger/8 p-4"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-danger-soft">
            <AlertCircle size={16} aria-hidden="true" />
            Formu gönderemedik
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-danger-soft">
            {errorList.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#${field}`}
                  className="underline underline-offset-4"
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(field)?.focus();
                  }}
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="name">
            Adınız <span className="text-accent-soft">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(fieldClass, "mt-2", errors.name && "border-danger")}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 flex items-center gap-1.5 text-sm text-danger-soft">
              <AlertCircle size={14} aria-hidden="true" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            E-posta <span className="text-accent-soft">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(fieldClass, "mt-2", errors.email && "border-danger")}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 flex items-center gap-1.5 text-sm text-danger-soft">
              <AlertCircle size={14} aria-hidden="true" />
              {errors.email}
            </p>
          )}
        </div>

        {services.length > 0 && (
          <div>
            <label className={labelClass} htmlFor="service">
              Hangi hizmetle ilgileniyorsunuz? <span className="text-accent-soft">*</span>
            </label>
            <select
              id="service"
              name="service"
              defaultValue=""
              aria-invalid={errors.service ? true : undefined}
              aria-describedby={errors.service ? "service-error" : undefined}
              className={cn(fieldClass, "mt-2 cursor-pointer", errors.service && "border-danger")}
            >
              <option value="">Bir hizmet seçin</option>
              {services.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
            {errors.service && (
              <p id="service-error" className="mt-2 flex items-center gap-1.5 text-sm text-danger-soft">
                <AlertCircle size={14} aria-hidden="true" />
                {errors.service}
              </p>
            )}
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="message">
            Projeniz
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={cn(fieldClass, "mt-2 resize-y")}
          />
        </div>
      </div>

      <Button type="submit" disabled={busy} className="mt-7 w-full font-semibold">
        {busy ? "Gönderiliyor…" : "Gönder"}
        {!busy && <ArrowRight size={17} aria-hidden="true" />}
      </Button>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "mt-4 min-h-5 text-sm",
          status.kind === "ok" && "text-emerald-300",
          status.kind === "error" && "text-danger-soft",
          status.kind === "" && "text-muted",
        )}
      >
        {status.text}
      </p>
    </form>
  );
}
