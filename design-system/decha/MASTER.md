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
