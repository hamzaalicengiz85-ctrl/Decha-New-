"use client";

import { ArrowDown, ArrowUp, ImageUp, Plus, Trash2 } from "lucide-react";
import { useActionState, useId, useState, useTransition } from "react";

import { cn } from "@/lib/cn";
import { uploadImage, type ActionState } from "@/app/actions";
import { Button, Card, Field, StatusLine, inputClass } from "./ui";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "url" | "checkbox" | "image";
  help?: string;
  placeholder?: string;
};

export type Item = Record<string, string | boolean>;

type Props = {
  items: Item[];
  fields: FieldDef[];
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  /** Yeni kayıt için boş şablon (id hariç) */
  blank: Omit<Item, "id">;
  /** Satır başlığında gösterilecek alan */
  titleField: string;
  addLabel: string;
  emptyText: string;
};

const initial: ActionState = { ok: false, message: "" };

/**
 * Dizi biçimli içerik (hizmetler, projeler, sosyal medya) için düzenleyici.
 *
 * Tüm liste tek bir gönderimde kaydedilir: kısmi yazma ya da yarım kalmış
 * kayıt durumu oluşmaz. Kaydedilmemiş değişiklik varken kullanıcı uyarılır.
 */
export function ListEditor({
  items: initialItems,
  fields,
  action,
  blank,
  titleField,
  addLabel,
  emptyText,
}: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [dirty, setDirty] = useState(false);
  const [state, formAction, pending] = useActionState(action, initial);
  const baseId = useId();

  function update(index: number, next: Item) {
    setItems((current) => current.map((item, i) => (i === index ? next : item)));
    setDirty(true);
  }

  function remove(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
    setDirty(true);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    setItems((current) => {
      const next = [...current];
      const a = next[index];
      const b = next[target];
      if (!a || !b) return current;
      next[index] = b;
      next[target] = a;
      return next;
    });
    setDirty(true);
  }

  function add() {
    setItems((current) => [
      ...current,
      { ...blank, id: crypto.randomUUID() } as Item,
    ]);
    setDirty(true);
  }

  return (
    <form
      action={(formData) => {
        setDirty(false);
        formAction(formData);
      }}
      className="space-y-4"
    >
      <input type="hidden" name="payload" value={JSON.stringify(items)} />

      {items.length === 0 ? (
        <Card className="border-dashed">
          <p className="text-sm text-muted">{emptyText}</p>
        </Card>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => {
            const title = String(item[titleField] ?? "").trim();
            return (
              <li key={String(item.id)}>
                <Card>
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="flex items-center gap-3 text-[0.95rem] font-medium">
                      <span className="font-mono text-[0.72rem] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={cn(!title && "text-muted")}>
                        {title || "Adsız kayıt"}
                      </span>
                    </h3>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label={`${index + 1}. kaydı yukarı taşı`}
                        className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-bone disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowUp size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                        aria-label={`${index + 1}. kaydı aşağı taşı`}
                        className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-bone disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowDown size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        aria-label={`${title || "Adsız kayıt"} kaydını sil`}
                        className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger-soft"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {fields.map((field) => (
                      <div
                        key={field.name}
                        className={cn(
                          (field.type === "textarea" || field.type === "image") &&
                            "sm:col-span-2",
                        )}
                      >
                        <ItemField
                          id={`${baseId}-${index}-${field.name}`}
                          field={field}
                          value={item[field.name] ?? ""}
                          onChange={(value) =>
                            update(index, { ...item, [field.name]: value })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="ghost" onClick={add}>
          <Plus size={16} aria-hidden="true" />
          {addLabel}
        </Button>

        <Button type="submit" disabled={pending}>
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </Button>

        {dirty && (
          <span className="text-sm text-muted">Kaydedilmemiş değişiklik var.</span>
        )}
      </div>

      <StatusLine state={state} />
    </form>
  );
}

function ItemField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: FieldDef;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
}) {
  const [uploading, startUpload] = useTransition();
  const [uploadError, setUploadError] = useState("");

  if (field.type === "checkbox") {
    return (
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-bone-dim">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 accent-[var(--color-accent)]"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "image") {
    const current = String(value ?? "");
    return (
      <Field label={field.label} help={field.help} htmlFor={id}>
        <div className="flex flex-wrap items-center gap-3">
          {current !== "" && (
            // Yüklenen görselin önizlemesi; boyutu önceden bilinmiyor
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current}
              alt=""
              className="size-16 rounded-lg border border-white/10 object-cover"
            />
          )}

          <label
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-white/12",
              "bg-white/[0.03] px-4 text-[0.9rem] transition-colors hover:border-white/25",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            <ImageUp size={16} aria-hidden="true" />
            {uploading ? "Yükleniyor…" : current ? "Değiştir" : "Görsel yükle"}
            <input
              id={id}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                setUploadError("");
                startUpload(async () => {
                  const data = new FormData();
                  data.set("file", file);
                  const result = await uploadImage(data);
                  if (result.ok) onChange(result.path);
                  else setUploadError(result.message);
                });
              }}
            />
          </label>

          {current !== "" && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-sm text-muted underline underline-offset-4 hover:text-danger-soft"
            >
              Kaldır
            </button>
          )}
        </div>

        {uploadError !== "" && (
          <p role="alert" className="mt-2 text-sm text-danger-soft">
            {uploadError}
          </p>
        )}
      </Field>
    );
  }

  if (field.type === "textarea") {
    return (
      <Field label={field.label} help={field.help} htmlFor={id}>
        <textarea
          id={id}
          rows={3}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={cn(inputClass, "resize-y")}
        />
      </Field>
    );
  }

  return (
    <Field label={field.label} help={field.help} htmlFor={id}>
      <input
        id={id}
        type={field.type === "url" ? "url" : "text"}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </Field>
  );
}
