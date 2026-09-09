# DECHA — Design System (Master)

> Kaynak: `ui-ux-pro-max` skill'inin yerleşik öncelik tablosu (erişilebilirlik →
> dokunma → performans → stil → layout → tipografi/renk → animasyon).
> Skill'in arama veri tabanı bu ortamda kurulu olmadığı için palet/font
> eşleşmesi veri tabanından değil, bu kurallardan ve marka briefinden türetildi.

## Marka

- **Ürün tipi:** dijital ajans / portfolyo–hizmet vitrini
- **Ton:** premium, koyu, enerjik, teknik
- **Stil yönü:** Dark glassmorphism + akkor (ember) vurgular, ince metalik kenarlıklar

## Renk tokenları

| Token | Değer | Kullanım |
|---|---|---|
| `--ink-900` | `#08080A` | Ana arka plan (siyah) |
| `--ink-700` | `#16171B` | Yükseltilmiş yüzey |
| `--steel-600` | `#23252B` | Kenarlık (metalik gri) |
| `--steel-300` | `#8A9099` | İkincil metin |
| `--steel-200` | `#B9BEC7` | Menü / gövde metni |
| `--ember-500` | `#FF6A1A` | Birincil vurgu (turuncu) |
| `--ember-600` | `#E24A0C` | Vurgu gradyan sonu |
| `--ember-300` | `#FFB169` | Vurgu gradyan başı |
| `--white` | `#FFFFFF` | Başlıklar |
| `--on-accent` | `#180701` | Turuncu üstündeki metin |

**Kontrast:** beyaz/`#08080A` ≈ 19:1 · `#B9BEC7`/`#08080A` ≈ 12:1 ·
`#8A9099`/`#08080A` ≈ 6.6:1 · `#180701`/`#FF6A1A` ≈ 8:1 — hepsi WCAG AA üstü.
Turuncu asla küçük gövde metni için zemin üstü metin rengi olarak kullanılmaz.

## Tipografi

- **Başlık:** Sora 600–800, `letter-spacing: -0.025em`, `line-height: 1.06`
- **Gövde:** Inter 400–500, taban 16px, `line-height: 1.6`
- **Hero başlık ölçeği:** `clamp(2.5rem, 5.4vw, 4.25rem)`
- Gövde metni asla 12px altına inmez.

## Aralık ölçeği (pazarlama / ferah)

`8 · 16 · 24 · 32 · 48 · 64 · 96 px` → `--space-1 … --space-7`

## Yapı

- Konteyner: `1200px`, yatay padding `24px`
- Header yüksekliği: `72px` (mobil `64px`), `scroll-padding-top` ile eşlenir
- Yarıçap: `10px` (küçük) · `16px` (kart) · `999px` (pill/buton)

## Hareket

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Süreler: hover `160ms` · durum geçişi `280ms` · vurgu `520ms`
- Ambiyans: orb süzülme `7s`, lav dönüşü `22s`, nabız `4.5s`
- Sadece `transform` / `opacity` animasyonlanır
- `prefers-reduced-motion` tüm hareketi kapatır

## Kaçınılacaklar (anti-pattern)

- Emoji'yi ikon yerine kullanmak (SVG kullanılır)
- Odak halkasını kaldırmak
- Yalnızca hover ile erişilebilen etkileşim
- Gri üstüne gri düşük kontrastlı metin
- Bileşen içinde ham hex değeri (her zaman token)
- Sabit px konteyner genişliği / yatay kaydırma

---

## Not: skill veri tabanı kurulumu (sonradan eklendi)

`ui-ux-pro-max` skill'i artık veri tabanıyla birlikte `.claude/skills/ui-ux-pro-max/`
altında kurulu. Doğrulama sorgusu çalıştırıldı:

```
search.py "digital agency portfolio dark premium" --design-system -p "DECHA"
```

Veri tabanının önerisi: *Liquid Glass* stili, **açık temalı** "premium black + gold"
paleti (`#FAFAF9` zemin, `#A16207` altın vurgu) ve **Cormorant / Montserrat** tipografi.

Bu öneri **uygulanmadı**: marka briefi siyah zemin + turuncu vurgu ve modern/teknik
bir ton istiyor; altın-lüks yönü briefe aykırı. Aşağıdaki noktalar ise veri tabanı
çıktısıyla örtüştüğü için doğrulanmış sayılır:

- Glassmorphism gereksinimleri: `backdrop-filter: blur(10–20px)`, 1px translucent
  kenarlık, metin kontrastı ≥ 4.5:1, `reduced-motion` desteği — hepsi uygulandı.
- Teslim öncesi kontrol listesi: emoji ikon yok (SVG), hover geçişleri 150–300ms,
  görünür odak halkaları, `prefers-reduced-motion`, 375/768/1024/1440 kırılımları.
- Kaçınılacaklar: "ucuz görünüm + çok hızlı animasyon" — orb ve buton süreleri
  buna göre yavaş tutuldu (7s süzülme, 280ms geçiş).

---

## Adım 2 — veri tabanı sorguları ve uygulanan kararlar

| Sorgu | Sonuç | Uygulama |
|---|---|---|
| `"services feature cards grid" --domain landing` | **Feature-Rich Showcase**: Hero → 4-6 kartlık özellik grid'i, kart başına tek mesaj | 4 kart, her kartta tek net vaat |
| `"scroll reveal stagger" --domain gsap` | **Scroll Reveal / Subtle**: y 8-16px, 300-400ms, `power1.out`, viewport girişinde, tek seferlik | 14px / 380ms / `ease-out`, IntersectionObserver, `unobserve` ile tek seferlik |
| aynı sorgunun "Don't" maddesi | "JS olmadan görünmeyen içerik bırakma" | reveal stilleri yalnızca `.js` altında; JS kapalıyken içerik görünür |
| `"card hover elevation focus keyboard" --domain ux` | Görünür odak halkası zorunlu; odak sticky içerikle kapanmamalı | `:focus-visible` korunuyor, `scroll-padding-top` header yüksekliği kadar |
| `"mobile app development..." --domain icons` | 0 sonuç → daralttım: `"device mobile phone"` | Phosphor outline setinden `device-mobile`, `trend-up`, `share`, `monitor` adlarına karşılık gelen satır içi SVG'ler |

Kart bileşeni tokenları: zemin `#1F2024 → #1A1A1D` gradyan, kenarlık `--steel-600`,
hover kenarlık `rgba(255,106,26,.55)`, kalkış `-8px`, geçiş `280ms`.

Kontrast: kart gövde metni `#8A9099` / kart zemini `#1C1D21` ≈ 4.9:1 (AA ✓),
kart başlığı beyaz ≈ 14.7:1 (AAA ✓).

---

## Adım 3 — veri tabanı sorguları ve uygulanan kararlar

| Sorgu | Sonuç | Uygulama |
|---|---|---|
| `"portfolio gallery showcase" --domain landing` | **Portfolio Grid**: masonry grid, "Visuals first", CTA kart hover'da, "Fast loading essential" | Asimetrik `grid-template-areas` düzeni; ~1.5 KB SVG yer tutucular, `loading="lazy"`, `width/height` ile CLS koruması |
| `"hover only content reveal" --domain ux` | **"Hover vs Tap"** (severity: High): dokunmatikte hover çalışmaz, önemli bilgiyi yalnızca hover'a bağlama | Proje adı her zaman görünür; hover yalnızca katmanı, kategoriyi ve zoom'u ekliyor |

Portfolyo bileşeni tokenları: kart yarıçapı `12px`, zoom `scale(1.08)` / `620ms`,
hover katmanı `rgba(8,8,10,.15 → .88)` dikey gradyan, kenarlık hover
`rgba(255,106,26,.5)`, görsel filtresi `saturate(1.12) contrast(1.06)`
(hover'da `1.25 / 1.1`).

Bölüm zemini: `#0B0C0F → #121319 → #0A0A0C` dikey gradyan + iki metalik gri
radyal dalga + 115°'lik `repeating-linear-gradient` doku, üst/alt `mask-image`
ile siyaha eriyor.

### Scroll reveal davranışı hakkında not

`rootMargin: 0 0 -10% 0` gözlem alanının alt %10'unu dışarıda bırakıyor.
Sayfa daha fazla kaydırılamadığında bu banttaki öğeler hiç açılmayacağı için
`main.js` içinde bir "sayfa sonu" koruması var; font/görsel geç yüklendiğinde
sayfa yüksekliği değişebildiğinden `load` ve `ResizeObserver` ile de
yeniden değerlendiriliyor.

---

## Adım 4 — veri tabanı sorguları ve uygulanan kararlar

`"form validation error label" --domain ux` sorgusu dört **High** kural döndürdü;
dördü de uygulandı: Focusable Error Summary, Error Messages (duyurulan),
Submit Feedback (loading → success/error), Form Labels (gerçek `<label for>`).

### Form bileşeni tokenları

| Öğe | Değer |
|---|---|
| Input zemini | `#1A1B1F` (hover/odak `#1E1F24`) |
| Input kenarlığı | yalnızca alt: 1px `--steel-400` |
| Odak göstergesi | alt çizgi 2px `--ember-500` + `0 6px 20px -6px rgba(255,106,26,.65)` |
| Hata rengi | çizgi `#F87171`, metin `#FCA5A5` (+ uyarı ikonu) |
| Form kartı | `#17181C → #121316`, 1px `--steel-600`, 16px yarıçap |

### Gönder butonu: brief ile erişilebilirlik çakışması

Brief "tamamen turuncu, beyaz kalın yazı" istiyor. Marka turuncusu
`--ember-500` (#FF6A1A) üzerine beyaz metin **2.9:1** kontrast veriyor —
AA için gereken 4.5:1'in altında (skill öncelik tablosu #1: Accessibility,
CRITICAL).

Çözüm: buton turuncu ve yazı beyaz kaldı, turuncu tonu geçer seviyeye kadar
koyulaştırıldı: `#CF450A → #B93F08 → #9E3204` gradyanı, beyaz metinle
**4.67:1 – 7.2:1**. Hero'daki parlak CTA (koyu metinli, ~8:1) olduğu gibi duruyor;
iki buton bilinçli olarak farklı tonda.

### Kaydırma boşluğu

`html { scroll-padding-top }` tek başına yeterli; `.section` üzerinde ayrıca
`scroll-margin-top` vermek boşluğu ikiye katlıyordu (96px yerine 168px).
`scroll-margin-top` kaldırıldı.

---

## Adım 5 — veri tabanı sorguları ve uygulanan kararlar

| Sorgu | Sonuç | Uygulama |
|---|---|---|
| `"back to top floating button" --domain ux` | **"Back Button"** (severity: High): tarayıcı geri davranışı bozulmamalı | Buton `<a href="#hero">` değil `<button>` + `window.scrollTo`; hash ve `history.length` değişmiyor (test edildi) |
| `"mobile font size readability" --domain ux` | **"Readable Font Size"** (severity: High): mobilde gövde metni en az 16px | 375px'te 16px altındaki tüm gövde metinleri büyütüldü; kalanlar UI mikro-kopyası |

### Yukarı çık butonu tokenları

Boyut 52px (≤640px'te 48px), tam yuvarlak, `--ember-400 → --ember-600` gradyan,
gölge `0 10px 30px rgba(255,106,26,.35)`, hover'da `-3px` kalkış,
`:active` `scale(0.94)`. Eşik: `max(320px, innerHeight * 0.8)`.
Kapalı durumda `visibility: hidden` — sekme sırası ve erişilebilirlik ağacı dışında.

### Mobil tipografi alt sınırları (≤640px)

| Öğe | Önce | Sonra |
|---|---|---|
| `.card__text` | 15px | 16px |
| `.form__status` | 15px | 16px |
| `.field__label` | 14px | 15px |
| `.field__error`, `.form__summary-list` | 13/14px | 15px |
| `.footer__copy` | 14px | 15px |
| `.work__tag` | 12px | 13px |
