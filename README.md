# DECHA

Dijital ajans için tek sayfalık site ve içeriğini yöneten panel.

Site üzerindeki **bütün işletme verisi** `content/content.json` dosyasından gelir;
kodun içinde gömülü metin, sahte proje ya da örnek müşteri bilgisi yoktur.
Depo şu an **boş içerikle** gelir: her bölüm, verisi girilene kadar tasarlanmış
bir yer tutucu gösterir.

## Yapı

```
apps/web        Ana site (Next.js 16, App Router)
apps/admin      Yönetim paneli (ayrı Next.js uygulaması, port 3001)
packages/content  Paylaşılan içerik şeması (Zod) ve dosya deposu
content/        content.json + yüklenen görseller (uploads/)
legacy/         Önceki saf HTML/CSS/JS sürümü (arşiv)
design-system/  Tasarım kararları
```

**Kullanılan yığın:** Next.js + React 19, TypeScript (strict), Tailwind CSS v4,
Framer Motion, lucide-react, Zod, clsx + tailwind-merge.

## Kurulum

```bash
npm install

# Panelin şifresini tanımlayın (tanımlanmadan panel açılmaz)
cp apps/admin/.env.example apps/admin/.env.local
# .env.local içine ADMIN_PASSWORD=... yazın

npm run dev         # site  → http://localhost:3000
npm run dev:admin   # panel → http://localhost:3001
```

Diğer komutlar:

```bash
npm run build       # her iki uygulamayı derler
npm run typecheck   # üç paketin tamamında tsc --noEmit
npm run lint
```

## İçerik akışı

```
Panel (apps/admin)  →  content/content.json  →  Site (apps/web)
       yazar               tek kaynak              okur
```

- Panel kaydettiğinde dosya **atomik** yazılır (önce geçici dosya, sonra taşıma),
  böylece yarıda kesilen bir kayıt dosyayı bozmaz.
- Ana site sayfası `force-dynamic`: kaydettiğiniz an, yeniden derlemeye gerek
  kalmadan sitede görünür.
- Görseller `content/uploads/` altına yüklenir ve her iki uygulamada
  `/uploads/...` yolundan servis edilir. Depoya dâhil değildir (`.gitignore`).

### Boş durumlar

Veri girilmemiş her alan, kırık bir sayfa yerine kesik çizgili bir yer tutucu
gösterir. Siteyi içerik tamamlanmadan yayına alacaksanız
`NEXT_PUBLIC_HIDE_EMPTY=1` ile bu yer tutucular tamamen gizlenir; bölümler
sessizce boş kalır.

Bazı alanlar boşken tamamen gizlenir (yer tutucu bile göstermez): hero
düğmeleri, bölüm açıklamaları, sosyal medya listesi. Böylece yarım dolu bir
site bile derli toplu görünür.

## Yönetim paneli

Şimdilik **ayrı bir uygulama**. İleride ana sitenin içine gizli bir yola
taşınacak; içerik katmanı (`packages/content`) ortak olduğu için bu taşıma
yalnızca yönlendirme meselesidir.

| Sayfa | İçerik |
|---|---|
| Genel bakış | Hangi bölüm dolu, hangisi boş; son kayıt zamanı |
| Site metinleri | Marka, SEO, hero, bölüm başlıkları, alt bilgi |
| Hizmetler | Başlık, ikon adı, açıklama — sırala, sil, ekle |
| İşler | Proje adı, kategori, yıl, bağlantı, görsel yükleme, öne çıkarma |
| İletişim | E-posta, telefon, konum, form uç noktası + sosyal medya |

### Güvenlik

- Panel `ADMIN_PASSWORD` tanımlanmadan **açılmaz**; varsayılan şifre yoktur.
- Şifre karşılaştırması ve oturum jetonu doğrulaması sabit sürede yapılır
  (`timingSafeEqual`).
- Oturum çerezi `httpOnly`, üretimde `secure`, ömrü 12 saat.
- Middleware çerezi olmayan her isteği `/giris`'e yönlendirir; jetonun imzası
  ayrıca sunucu tarafında (Node çalışma zamanında) doğrulanır.
- Her yazma işlemi ve görsel yükleme oturum doğrulamasından geçer.
- Yüklenen dosyanın adı tamamen yeniden üretilir; servis ederken yolun
  `uploads/` dışına çıkmadığı doğrulanır (path traversal koruması).
- Tür ve boyut kısıtı: JPG, PNG, WEBP, AVIF, SVG — en fazla 8 MB.

> Panel yayına alınacaksa, mutlaka HTTPS arkasında ve tercihen ek bir ağ
> kısıtıyla (IP izni, VPN) çalıştırın. Tek şifreli giriş küçük ekipler için
> yeterlidir; çok kullanıcılı bir kurulum gerekiyorsa oturum katmanı
> değiştirilmelidir.

## İletişim formu

- `content.contact.formEndpoint` doluysa form JSON olarak o adrese `POST` edilir.
- Boşsa ziyaretçinin e-posta uygulaması hazır bir mesajla açılır.
- Her ikisi de boşsa form devre dışı kalır ve bunu açıkça söyler — hiçbir
  durumda "gönderildi" yanılsaması oluşturulmaz.

## Erişilebilirlik

- Gövde metni ≥ 16px, mono mikro etiketler 12px alt sınırında.
- Tüm dokunma hedefleri en az 44×44 px.
- Form hataları hem alan altında hem odaklanabilir bir özet kutusunda
  (`role="alert"`) duyurulur; ikon + metin kullanılır, renk tek başına anlam
  taşımaz.
- `prefers-reduced-motion` tüm animasyonları kapatır; Framer Motion bileşenleri
  son hâlleriyle render edilir.
- Görünür odak halkaları korunur, "İçeriğe geç" atlama bağlantısı vardır.

## Dağıtım

Her iki uygulama da Node çalışma zamanı ister (`force-dynamic` sayfalar, dosya
yazan sunucu aksiyonları). Vercel, Render, Fly ya da kendi sunucunuz olabilir.

Dikkat edilecek tek nokta: `content/` klasörü **yazılabilir ve kalıcı** olmalı.
Dosya sistemi geçici olan platformlarda (ör. salt okunur konteyner) panel kayıt
yapamaz; bu durumda `DECHA_CONTENT_DIR` ile kalıcı bir birim gösterin.

## Arşiv

`legacy/vanilla-site/` — siyah/turuncu kimlikle yapılmış önceki saf HTML/CSS/JS
sürüm. Tasarım kararları `design-system/decha/v1-vanilla-arsiv.md` dosyasında.
