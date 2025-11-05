# PowerShell script to convert logo to favicon formats
# Requires: Install via `winget install ImageMagick.ImageMagick`

$sourceLogo = "D:\Affinity Files\Affinity Designer\Logo\HowToCook.png"
$appDir = "$PSScriptRoot\src\app"
$publicDir = "$PSScriptRoot\public"

# Check if ImageMagick is installed
$magickInstalled = Get-Command magick -ErrorAction SilentlyContinue

if (-not $magickInstalled) {
    Write-Host "❌ ImageMagick not found. Installing..." -ForegroundColor Red
    Write-Host "Please install ImageMagick:" -ForegroundColor Yellow
    Write-Host "  winget install ImageMagick.ImageMagick" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OR use an online converter:" -ForegroundColor Yellow
    Write-Host "  https://favicon.io/favicon-converter/" -ForegroundColor Cyan
    Write-Host "  https://realfavicongenerator.net/" -ForegroundColor Cyan
    exit
}

# Create directories if they don't exist
if (-not (Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir -Force
}

Write-Host "🎨 Converting logo to favicon formats..." -ForegroundColor Green

# 1. Create favicon.ico (16x16 and 32x32 combined)
Write-Host "Creating favicon.ico (16x16 + 32x32)..." -ForegroundColor Cyan
magick "$sourceLogo" -resize 16x16 "$appDir\favicon-16.png"
magick "$sourceLogo" -resize 32x32 "$appDir\favicon-32.png"
magick "$appDir\favicon-16.png" "$appDir\favicon-32.png" "$appDir\favicon.ico"
Remove-Item "$appDir\favicon-16.png"
Remove-Item "$appDir\favicon-32.png"

# 2. Create icon.png (512x512)
Write-Host "Creating icon.png (512x512)..." -ForegroundColor Cyan
magick "$sourceLogo" -resize 512x512 "$appDir\icon.png"

# 3. Create apple-icon.png (180x180)
Write-Host "Creating apple-icon.png (180x180)..." -ForegroundColor Cyan
magick "$sourceLogo" -resize 180x180 "$appDir\apple-icon.png"

# 4. Create web manifest icons
Write-Host "Creating web manifest icons..." -ForegroundColor Cyan
magick "$sourceLogo" -resize 192x192 "$publicDir\icon-192.png"
magick "$sourceLogo" -resize 512x512 "$publicDir\icon-512.png"

Write-Host "✅ Favicon conversion complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Files created:" -ForegroundColor Yellow
Write-Host "  - src/app/favicon.ico (16x16 + 32x32)" -ForegroundColor White
Write-Host "  - src/app/icon.png (512x512)" -ForegroundColor White
Write-Host "  - src/app/apple-icon.png (180x180)" -ForegroundColor White
Write-Host "  - public/icon-192.png (192x192)" -ForegroundColor White
Write-Host "  - public/icon-512.png (512x512)" -ForegroundColor White
Write-Host ""
Write-Host "Next step: Run the manifest script to create site.webmanifest" -ForegroundColor Cyan
