"use client";

import { useActionState } from "react";

import type { Contact } from "@decha/content";

import { saveContact, type ActionState } from "@/app/actions";
import { Button, Card, Field, StatusLine, inputClass } from "@/components/ui";

const initial: ActionState = { ok: false, message: "" };

export function ContactDetailsForm({ contact }: { contact: Contact }) {
  const [state, formAction, pending] = useActionState(saveContact, initial);

  return (
    <form action={formAction}>
      <Card>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="E-posta"
            htmlFor="email"
            help="Form uç noktası boşken gönderilen mesajlar bu adrese açılır."
          >
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={contact.email}
              className={inputClass}
            />
          </Field>

          <Field label="Telefon" htmlFor="phone">
            <input
              id="phone"
              name="phone"
              type="text"
              defaultValue={contact.phone}
              className={inputClass}
            />
          </Field>

          <Field label="Konum" htmlFor="location">
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={contact.location}
              className={inputClass}
            />
          </Field>

          <Field
            label="Form uç noktası"
            htmlFor="formEndpoint"
            help="Formspree, Basin gibi bir servisin POST adresi. Boşsa e-posta uygulaması açılır."
          >
            <input
              id="formEndpoint"
              name="formEndpoint"
              type="url"
              placeholder="https://…"
              defaultValue={contact.formEndpoint}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Button type="submit" disabled={pending}>
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </Button>
          <StatusLine state={state} />
        </div>
      </Card>
    </form>
  );
}
