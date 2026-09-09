# DECHA — Tasarım Sistemi (v2)

Önceki kimlik (siyah zemin + turuncu vurgu + Sora/Inter) tamamen bırakıldı;
arşivi `v1-vanilla-arsiv.md` dosyasında.

## Yön

Editoryal monokrom. Bir moda/mimarlık dergisi kapağının sakinliği ile
Linear/Vercel arayüzlerinin teknik netliğini birleştirir: geniş serif başlıklar,
mono mikro etiketler, tek ve ölçülü bir ışık kaynağı.

Tipografi eşleşmesi `ui-ux-pro-max` typography veri tabanından alındı
("Classic Elegant": Playfair Display + Inter; mono etiket yaklaşımı
"Minimalist Monochrome Editorial" kaydından). Palet ise "monochrome + accent"
portfolyo profilinden koyu temaya uyarlandı.

## Renk

| Token | Değer | Kullanım |
|---|---|---|
| `--color-ink` | `#08080A` | Zemin |
| `--color-ink-raised` | `#0F0F12` | Kart |
| `--color-ink-high` | `#16161B` | Yükseltilmiş yüzey |
| `--color-bone` | `#F5F1EA` | Birincil metin |
| `--color-bone-dim` | `#B9B4AC` | Gövde metni |
| `--color-muted` | `#8B8B93` | İkincil / etiket |
| `--color-accent` | `#4F46E5` | Dolgu düğme, odak |
| `--color-accent-hover` | `#4338CA` | Düğme hover |
| `--color-accent-soft` | `#A5B4FC` | Vurgu metni, italik öbek, ışıma |

**Sıcaklık kontrastı bilinçlidir:** metin saf beyaz değil sıcak kemik
(`#F5F1EA`), vurgu ise soğuk indigo. İkisinin gerilimi, tek renkli koyu
tasarımların "ucuz plastik" hissini kırar.

Kontrast: kemik/mürekkep ≈ 17:1 · `bone-dim` ≈ 10:1 · `muted` ≈ 5.2:1 ·
beyaz metin `--color-accent` üzerinde **6.3:1** (AA üstü). Vurgu rengi hiçbir
zaman koyu zemin üzerinde küçük gövde metni olarak kullanılmaz;
`accent-soft` bunun için ayrılmıştır.

## Tipografi

| Rol | Yazı tipi | Kullanım |
|---|---|---|
| Display | Playfair Display 400–700 (italik dahil) | Başlıklar, marka, kart başlıkları |
| Gövde | Inter 300–600 | Paragraflar, form, panel |
| Etiket | JetBrains Mono 400–500 | Büyük harf, geniş aralıklı mikro etiketler |

- Hero: `clamp(2.75rem, 7vw, 5.25rem)`, `leading-[0.98]`, `tracking-[-0.03em]`.
- Vurgulanan öbek serif **italik** ve `accent-soft` — sitenin imza hareketi.
- Gövde ≥ 16px; mono etiketler 12px alt sınırında (11px'e düşen ilk sürüm
  denetimde yakalanıp düzeltildi).

## Uzam ve biçim

- 4/8pt ızgara (`--spacing: 0.25rem`).
- Konteyner `max-w-6xl`, yatay dolgu 24px (mobil) / 40px (masaüstü).
- Kart yarıçapı `1rem`, düğmeler tam yuvarlak.
- Kenarlıklar `white/6`–`white/12`; kartların üst kenarında 1px'lik iç ışık
  (`.hairline`).
- Tüm sayfada `%3.5` opaklıkta SVG gren dokusu (`.noise-overlay`).

## Hareket

Framer Motion, yay fiziği (`spring`, stiffness 120–200, damping 20–22).
Süre değil sertlik ayarlanır — hareket mekanik değil fiziksel hissedilir.

- Giriş: `opacity 0 → 1`, `y 18 → 0`, grup içinde 70ms kademeli.
- Hover: `-1px`/`-3px` kalkış, 500ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
- `prefers-reduced-motion`: bileşenler animasyonsuz, son hâlleriyle render
  edilir (opacity hilesi değil, gerçek koşullu render).

## Kaçınılanlar

- Simetrik, ortalanmış "AI düzeni" — hero 12 sütunda 9/3 bölünür, kenar sütunu
  kasıtlı olarak boş bırakılır.
- Renk çokluğu: tek vurgu rengi, tek ışık kaynağı.
- Gömülü uydurma içerik — bütün metin `content.json` üzerinden gelir.
- Emoji ikon (lucide-react kullanılır), yalnızca hover'a bağlı bilgi,
  odak halkasının kaldırılması.
