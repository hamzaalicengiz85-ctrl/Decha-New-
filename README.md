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

## Adım 3 — İşlerimiz (Portfolyo)

- **"Dijital İzlerimiz"** bölümü (`#islerimiz`), asimetrik grid.
- Düzen `grid-template-areas` ile: masaüstünde 4 sütun (`a a b c / a a d d /
  e e f f`), ≤1100px'te 2 sütun, ≤640px'te tek sütun (4:3 kartlar).
- Kartlar: 12px köşe, `overflow: hidden`, hover'da görsel `scale(1.08)`
  (620ms), siyah yarı saydam katman, turuncu kategori etiketi ve turuncu
  kenarlık parlaması.
- **Proje adı her zaman görünür**, hover'da güçlenir. Sebep: dokunmatik
  cihazlarda hover yok (`ux-guidelines.csv` → "Hover vs Tap", severity: High).
- Bölüm arka planı: çok hafif metalik gri radyal dalgalar + 115° geometrik
  çizgi dokusu, üst/alt maskeyle siyaha eriyor — simsiyah bölümlerden ayrışıyor.

### Yer tutucu görseller

`assets/img/portfolio/proje-0X.svg` dosyaları `tools/generate-placeholders.py`
ile üretiliyor (her biri ~1.5 KB, canlı gradyan + soyut geometri).

```bash
python3 tools/generate-placeholders.py
```

> **Dikkat:** Kartlardaki proje adları (Ember Kahve, Nova Fintech, Atlas Spor,
> Kite Studio, Vertex Enerji, Lumen Festival) **kurgusal yer tutuculardır**,
> gerçek müşteri işi değildir. Siteyi yayına almadan önce gerçek işlerinizle
> değiştirin. Görselleri değiştirmek için `assets/img/portfolio/` içindeki
> dosyaları kendi görsellerinizle (jpg/webp) değiştirip `index.html`'deki
> `src` uzantılarını güncellemeniz yeterli.

## Adım 4 — İletişim ve Footer

- **"Birlikte Yaratalım"** bölümü (`#iletisim`), iki kolon: solda samimi metin +
  iletişim bilgileri + sosyal medya ikonları (gri → hover'da turuncu),
  sağda iletişim formu. ≤960px'te tek kolona iniyor.
- **Form alanları:** Adınız, E-posta, "Hangi hizmetle ilgileniyorsunuz?"
  (App Geliştirme / Web Tasarım / Sosyal Medya / Dijital Pazarlama).
- **Kutu tasarımı:** koyu metalik gri zemin (`#1A1B1F`), yalnızca alt kenarlık;
  odakta alt çizgi turuncu parlıyor (2px + glow — görünür odak göstergesi).
- **Gönder butonu:** turuncu, beyaz kalın yazı, tıklayınca `scale(0.97)`.
- **Footer:** siyah, DECHA logosu + "© 2026 DECHA. Tüm hakları saklıdır."
  (yıl JS ile güncel tutuluyor, JS yoksa 2026 yazılı kalır).

### Form doğrulama ve erişilebilirlik

`ui-ux-pro-max` ux-guidelines'daki dört High kural uygulandı:

| Kural | Uygulama |
|---|---|
| Focusable Error Summary | Formun üstünde `role="alert" tabindex="-1"` özet kutusu; her madde ilgili alana bağlantı; başarısız gönderimde odak özete taşınıyor |
| Error Messages | Hatalar `role="alert"` ile duyuruluyor; ikon + metin (renk tek başına anlam taşımıyor) |
| Submit Feedback | Buton "Gönderiliyor…" durumuna geçiyor, ardından başarı/hata mesajı `role="status"` ile bildiriliyor |
| Form Labels | Her alanda gerçek `<label for>`; placeholder etiket olarak kullanılmıyor |

Ek olarak: `aria-invalid`, `aria-describedby`, `autocomplete` ve `inputmode`
öznitelikleri; kullanıcı düzeltmeye başlayınca ilgili alanın hatası kalkıyor.

### Formu bir servise bağlama

`assets/js/main.js` dosyasının başındaki iki sabit:

```js
var CONTACT_ENDPOINT = "";              // Formspree / Basin / Netlify Forms POST adresi
var CONTACT_EMAIL = "merhaba@decha.com"; // endpoint boşken kullanılan adres
```

- **Boşken** (varsayılan): form doğrulanır, sonra ziyaretçinin e-posta
  uygulaması hazır bir mesajla açılır. Ek kurulum gerekmez, hiçbir şey
  "gönderildi" gibi gösterilmez.
- **Adres girildiğinde:** form JSON olarak o adrese `POST` edilir; başarı ve
  hata durumları kullanıcıya bildirilir.

> **Yer tutucular:** `merhaba@decha.com`, `+90 (5XX) XXX XX XX`,
> `İstanbul, Türkiye` ve sosyal medya bağlantıları (`href="#"`) örnek
> değerlerdir. Yayına almadan önce gerçek bilgilerinizle değiştirin.

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

## Skills CLI (skills.sh)

Skill paketlerini yönetmek için [skills.sh](https://www.skills.sh) CLI'ı
(`vercel-labs/skills`) kullanılıyor.

```bash
npm install -g skills          # kurulum (bu depoda v1.5.25 ile doğrulandı)
skills list                    # projedeki skill'leri listele
skills add <owner>/<repo> -l   # bir deponun içindeki skill'leri kurmadan listele
skills add <owner>/<repo>      # projeye kur (-g ile kullanıcı geneli)
skills update                  # kurulu skill'leri güncelle
```

**Bu ortama özel not:** oturum konteyneri geçici olduğu için global npm kurulumu
kalıcı değil; yeni bir oturumda `npm install -g skills` komutunu tekrar çalıştırın.

**Ağ kısıtı:** `www.skills.sh` bu ortamın egress proxy'si tarafından engelli
(CONNECT tunnel 403). Bu yüzden kayıt defteri araması (`skills find`) sonuç
döndürmüyor; GitHub üzerinden kurulum (`skills add <owner>/<repo>`) sorunsuz
çalışıyor. Skill aramak için depo adını doğrudan vermek gerekiyor.

Projedeki `ui-ux-pro-max` skill'i doğrudan depoya kopyalanmış durumda (symlink
değil), böylece klonlayan herkeste ve her yeni oturumda hazır geliyor;
`skills list` onu proje skill'i olarak görüyor.

## Adım 5 — Animasyonlar ve son rötuşlar

### Fade-in-up scroll animasyonu

Adım 2'de kurulan IntersectionObserver tabanlı reveal artık sayfadaki
**25 öğeyi** kapsıyor: bölüm başlıkları, hizmet kartları, portfolyo görselleri,
iletişim metni ve form. Aşağıdan yukarıya (14px) süzülerek, grup içinde 70ms
kademeli gecikmeyle giriyorlar.

### Yukarı çık butonu

- Sağ altta sabit, turuncu, 52px (mobilde 48px) yuvarlak buton.
- Yalnızca `max(320px, ekran yüksekliğinin %80'i)` kadar kaydırıldıktan sonra
  görünür; kapalıyken `visibility: hidden` ile sekme sırasından ve
  erişilebilirlik ağacından çıkar.
- **Hash değiştirmiyor** (`<a href="#hero">` değil, `<button>` + `scrollTo`).
  Sebep: `ux-guidelines.csv` → "Back Button" (severity: High) — tarayıcının geri
  düğmesi bozulmamalı. Test edildi: `location.hash` ve `history.length`
  tıklama sonrası değişmiyor.
- Tıklayınca odak header'daki logoya taşınıyor (`preventScroll: true`), böylece
  klavye kullanıcısı sayfanın başından devam ediyor.
- `prefers-reduced-motion` açıkken yumuşak kaydırma yerine anında tepeye gidiyor.
- Alt konumu `env(safe-area-inset-bottom)` ile çentikli ekranlara uyumlu.

### Mobil denetim (375 × 812, 2x DPR)

| Kontrol | Sonuç |
|---|---|
| Yatay taşma | yok (`scrollWidth` = 375) |
| 44px altı dokunma hedefi | yok |
| 16px altı **gövde** metni | yok |

`ux-guidelines.csv` → "Readable Font Size" (severity: High) gereği mobilde
büyütülenler: kart açıklamaları 15 → 16px, form durum mesajı 15 → 16px,
form etiketleri 14 → 15px, hata metinleri 13 → 15px, footer telifi 14 → 15px,
portfolyo kategori etiketi 12 → 13px.

16px altında bilinçli olarak bırakılanlar, gövde metni değil UI mikro-kopyasıdır:
`eyebrow` kickerları (13px, büyük harf + geniş harf aralığı), portfolyo kategori
etiketleri (13px) ve form etiketleri (15px).
