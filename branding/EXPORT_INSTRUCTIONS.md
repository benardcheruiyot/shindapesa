# Exporting the Play Store Icon

You now have:
- `branding/play-icon-512.svg` (exact 512x512 artboard)
- `branding/shindapesa-icon-1024.svg` (master 1024 source)

## Quick PNG Export (Any Tool)
1. Open `branding/play-icon-512.svg`.
2. Export/Save As PNG (512 x 512) at 100% scale.
3. Name file: `play-icon-512.png`.
4. Ensure file size < 1 MB.
5. Upload to Play Console > Main Store Listing > App Icon.

## Figma
- Import SVG, select frame, File > Export > PNG (1x) -> play-icon-512.png.

## Inkscape
```
File > Export PNG > Export Area: Page
Width: 512 (should already match)
Click Export
```

## Illustrator
```
File > Export > Export As...
Format: PNG
Resolution: 72 ppi (gives 512 since artboard is 512)
Transparency: None
```

## Command-line (Inkscape installed)
```
inkscape branding/play-icon-512.svg -w 512 -h 512 -o branding/play-icon-512.png
```

## Verification Checklist
- Dimensions: 512x512
- Square (no rounded corners)
- Background solid #003366
- White S stroke + green dot visible
- No extra padding beyond design

Keep the 1024 master for future assets (feature graphic variants, etc.).
