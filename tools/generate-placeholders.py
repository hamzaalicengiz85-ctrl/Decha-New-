#!/usr/bin/env python3
"""DECHA portfolyo için canlı, soyut SVG yer tutucu görseller üretir.

Gerçek proje görselleri hazır olduğunda assets/img/portfolio/ içindeki
dosyaları aynı adlarla (.jpg/.webp) değiştirmek yeterli; index.html'de
sadece uzantıyı güncelleyin.

Kullanım:  python3 tools/generate-placeholders.py
"""
import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img" / "portfolio"

# (dosya adı, üst-sol renk, alt-sağ renk, sıcak blob, soğuk blob)
PALETTES = [
    ("proje-01", "#FF7A18", "#C1121F", "#FFD166", "#7A0E10"),
    ("proje-02", "#FF2E93", "#6D28D9", "#FF9CD8", "#2E1065"),
    ("proje-03", "#00E5FF", "#0057B8", "#A7F3D0", "#062A4A"),
    ("proje-04", "#B6FF3B", "#FF9E00", "#FDFFB6", "#2F4700"),
    ("proje-05", "#7C4DFF", "#00B0FF", "#C4B5FD", "#10173A"),
    ("proje-06", "#FF5757", "#FF9A3C", "#FFD6A5", "#4A0E0E"),
]

TEMPLATE = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"
     width="1000" height="1000" role="presentation">
  <defs>
    <linearGradient id="bg{i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{c1}"/>
      <stop offset="1" stop-color="{c2}"/>
    </linearGradient>
    <radialGradient id="warm{i}" cx="0.3" cy="0.28" r="0.55">
      <stop offset="0" stop-color="{c3}" stop-opacity="0.95"/>
      <stop offset="1" stop-color="{c3}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cool{i}" cx="0.78" cy="0.8" r="0.6">
      <stop offset="0" stop-color="{c4}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="{c4}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scrim{i}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.45" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.42"/>
    </linearGradient>
  </defs>

  <rect width="1000" height="1000" fill="url(#bg{i})"/>
  <rect width="1000" height="1000" fill="url(#warm{i})"/>
  <rect width="1000" height="1000" fill="url(#cool{i})"/>

  <!-- geometrik detaylar -->
  <g fill="none" stroke="#FFFFFF" stroke-opacity="0.20" stroke-width="2">
    <circle cx="{ox}" cy="{oy}" r="210"/>
    <circle cx="{ox}" cy="{oy}" r="330"/>
  </g>
  <path d="M-40 {ly} L1040 {ly2}" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="3"/>
  <path d="M-40 {ly3} L1040 {ly4}" stroke="#000000" stroke-opacity="0.18" stroke-width="6"/>

  <rect width="1000" height="1000" fill="url(#scrim{i})"/>
</svg>
'''

OUT.mkdir(parents=True, exist_ok=True)
for i, (name, c1, c2, c3, c4) in enumerate(PALETTES, start=1):
    svg = TEMPLATE.format(
        i=i, c1=c1, c2=c2, c3=c3, c4=c4,
        ox=280 + (i % 3) * 190, oy=300 + (i % 2) * 260,
        ly=180 + i * 60, ly2=420 + i * 40,
        ly3=640 + i * 30, ly4=520 + i * 55,
    )
    (OUT / f"{name}.svg").write_text(svg, encoding="utf-8")
    print("yazıldı:", name + ".svg")
