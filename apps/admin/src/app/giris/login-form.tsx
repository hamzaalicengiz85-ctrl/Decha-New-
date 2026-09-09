"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { login, type ActionState } from "@/app/actions";
import { Button, Field, StatusLine, inputClass } from "@/components/ui";

const initial: ActionState = { ok: false, message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.replace("/");
  }, [state.ok, router]);

  return (
    <form action={formAction} className="space-y-5 rounded-card border border-white/8 bg-ink-raised/70 p-6">
      <Field label="Şifre" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className={inputClass}
        />
      </Field>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Kontrol ediliyor…" : "Giriş yap"}
      </Button>

      <StatusLine state={state} />
    </form>
  );
}
