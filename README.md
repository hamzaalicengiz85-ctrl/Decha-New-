# DECHA — Dijital Ajans Web Sitesi

Tek sayfalık (single-page), koyu temalı ve premium bir dijital ajans sitesi.
Bağımlılık yok: saf HTML + CSS + vanilla JS.

## Şu an ne var? (Adım 1)

- **Sticky Header** — siyah, saydam, `backdrop-filter` ile glassmorphism.
  Sayfa kaydırıldığında koyulaşır ve gölge kazanır.
- **Logo** — "DECHA" kalın/geniş harf aralıklı, yanında turuncu nokta.
- **Menü** — Hizmetler · İşlerimiz · İletişim, yumuşak kaydırma (smooth scroll)
  ve sticky header yüksekliği kadar offset ile.
- **Mobil menü** — hamburger buton, Escape/dışarı tıklama ile kapanır.
- **Hero** — ekranı kaplayan karşılama bölümü: başlık, açıklama, turuncu CTA
  butonu (hover'da parlama + yukarı kalkma) ve sağda süzülen "ember orb".

## Adım 2 — Hizmetler

- **"Neler Yapıyoruz?"** bölümü (`#hizmetler`), siyah zemin devam ediyor.
- Ortalanmış başlık + altında turuncu vurgu çizgisi (`.section__rule`).
- 4 hizmet kartı: geniş ekranda 4'lü, ≤1100px'te 2x2, ≤640px'te alt alta.
- Kartlar metalik koyu gri (`#1F2024 → #1A1A1D`), hover'da yukarı kalkıyor
  (`translateY(-8px)`), turuncu kenarlık + turuncu gölge parlıyor, üst kenarda
  ışık şeridi beliriyor ve ikon turuncuya doluyor.
- **Scroll reveal:** IntersectionObserver ile viewport'a girince kademeli
  (70ms stagger) fade-up. `ui-ux-pro-max` motion veri tabanındaki
  "Scroll Reveal / Subtle" profiline uygun (y offset 14px, 380ms, tek seferlik).
  Stiller yalnızca `.js` sınıfı altında uygulandığı için **JS kapalıyken içerik
  görünür kalır**; `prefers-reduced-motion` açıkken de anında görünür.

`#islerimiz` ve `#iletisim` bölümleri şimdilik yalnızca boş kaydırma
hedefleridir; sonraki adımlarda içerikleri eklenecek.

## Görseller

`assets/img/` klasörüne aşağıdaki dosyalar bırakılırsa otomatik olarak kullanılır:

| Dosya | Kullanım | Dosya yoksa |
|---|---|---|
| `decha-logo.jpg` | Header logosu | CSS ile üretilen metin logo |
| `decha-ember-orb.jpg` | Hero imza figürü | Saf CSS ile üretilen akkor küre |

Dosya yoksa `<img>` etiketi JS tarafından kaldırılır; kırık görsel ikonu çıkmaz.

## Çalıştırma

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Yapı

```
index.html
assets/
  css/style.css   # tasarım tokenları + tüm stiller
  js/main.js      # header durumu, mobil menü, opsiyonel görseller
  img/            # decha-logo.jpg, decha-ember-orb.jpg (opsiyonel)
design-system/decha/MASTER.md   # renk/tipografi/aralık kararları
```

## Erişilebilirlik & performans notları

- Tüm dokunma hedefleri en az 44×44 px.
- Odak halkaları korunur (`:focus-visible`), "İçeriğe geç" atlama linki var.
- `prefers-reduced-motion: reduce` tüm animasyonları devre dışı bırakır.
- Animasyonlar yalnızca `transform` / `opacity` üzerinde çalışır (layout thrash yok).
- `backdrop-filter` desteklenmeyen tarayıcılarda header opak arka plana düşer.

## Kurulu Skill: UI/UX Pro Max

Tasarım kararları için `ui-ux-pro-max` skill'i projeye kuruludur:

```
.claude/skills/ui-ux-pro-max/
  SKILL.md        # kullanım talimatları
  data/           # 79 stil, 192 palet, 74 font eşleşmesi, 119 UX kuralı, 22 stack
  references/     # quick-reference.md, pro-rules.md
  scripts/        # search.py ve yardımcıları
```

- Kaynak: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (v2.13.0, MIT)
- Kurulum commit'i: upstream `4aad058` (2026-09-06)
- Geliştirme testleri (`scripts/tests/`) kurulumdan çıkarıldı; çalışma zamanında gerekmiyor.

Kullanım:

```bash
# Odaklı arama
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism dark premium" --domain style

# Stack rehberi
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "hero section responsive" --stack html-tailwind

# Komple tasarım sistemi önerisi
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "digital agency portfolio dark" --design-system -p "DECHA"
```
