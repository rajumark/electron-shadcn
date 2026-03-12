# Application Icons

This directory contains the application icons for all platforms.

## Setup Instructions

1. **Replace the placeholder icon**: Save your fish pixel art image as `icon.png` in this directory
   - Recommended size: 512x512 pixels (square ratio)
   - Format: PNG with transparency support

2. **Generate platform-specific icons**: Run the icon generation script
   ```bash
   npm run generate-icons
   ```

   This will create:
   - `icon.ico` - Windows icon file
   - `icon.icns` - macOS icon file  
   - `icon_{size}.png` - Various PNG sizes for Linux

## Requirements

The icon generation script requires **ImageMagick** to be installed:

### macOS
```bash
brew install imagemagick
```

### Ubuntu/Debian
```bash
sudo apt-get install imagemagick
```

### Windows
Download from https://imagemagick.org/script/download.php

## Manual Setup (Alternative)

If ImageMagick is not available, you can manually create:
- `icon.ico` for Windows (use an online converter)
- `icon.icns` for macOS (use an online converter or macOS Preview app)
- `icon.png` (512x512) for Linux

## CI/CD Integration

The icons are automatically used by the CI/CD builds:
- Windows builds will use `icon.ico`
- macOS builds will use `icon.icns` 
- Linux builds will use `icon.png`

No changes to the CI/CD workflows are needed - the icon path is configured in `forge.config.ts`.
