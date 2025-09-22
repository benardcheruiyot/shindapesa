# ShindaPesa Branding Assets

Files:
- `shindapesa-icon-1024.svg`: Source scalable vector for generating store icons.

## Generate 512x512 PNG (Play Console)
1. Open the SVG in a graphics tool (Figma, Inkscape, Illustrator, or VS Code extension).
2. Ensure export size is exactly 512 x 512 pixels.
3. Export as PNG, no transparency (background already solid #003366).
4. Name it `play-icon-512.png`.
5. Upload to Play Console > Main store listing > App icon.

## Optional 1024x1024 Variant
Play also accepts 512x512 only, but you can keep 1024 master for future scaling.

## Do Not Round Corners
Leave the square; Google will mask automatically on devices.

## Color Reference
- Background: `#003366`
- Accent: `#00A651`
- Stroke: `#FFFFFF`

## Updating Launcher Icon
The in-app adaptive icon already matches this design (vector + colors).
If you tweak the SVG path, replicate those changes in `android/app/src/main/res/drawable/ic_launcher_foreground.xml`.
