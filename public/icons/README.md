# App Icons

To generate the required icons for the PWA:

1. Create a 512x512px image with Pip-Boy green (#00FF41) theme
2. Generate the following sizes:
   - 180x180px (icon-180x180.png) - for iOS
   - 192x192px (icon-192x192.png) - for Android
   - 512x512px (icon-512x512.png) - for high-res displays

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Or use ImageMagick:
```bash
convert icon-512x512.png -resize 180x180 icon-180x180.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
```

