const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceLogo = 'D:\\Affinity Files\\Affinity Designer\\Logo\\HowToCook.png';
const appDir = path.join(__dirname, 'src', 'app');
const publicDir = path.join(__dirname, 'public');

async function generateFavicons() {
  try {
    console.log('🎨 Converting logo to favicon formats...');

    // Ensure directories exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // 1. Create icon.png (512x512)
    console.log('Creating icon.png (512x512)...');
    await sharp(sourceLogo)
      .resize(512, 512)
      .png()
      .toFile(path.join(appDir, 'icon.png'));

    // 2. Create apple-icon.png (180x180)
    console.log('Creating apple-icon.png (180x180)...');
    await sharp(sourceLogo)
      .resize(180, 180)
      .png()
      .toFile(path.join(appDir, 'apple-icon.png'));

    // 3. Create web manifest icons
    console.log('Creating icon-192.png (192x192)...');
    await sharp(sourceLogo)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));

    console.log('Creating icon-512.png (512x512)...');
    await sharp(sourceLogo)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));

    // 4. Create favicon.ico sizes (we'll use 32x32 PNG, then convert to ICO manually)
    console.log('Creating favicon-32.png (32x32)...');
    await sharp(sourceLogo)
      .resize(32, 32)
      .png()
      .toFile(path.join(appDir, 'favicon-32.png'));

    console.log('Creating favicon-16.png (16x16)...');
    await sharp(sourceLogo)
      .resize(16, 16)
      .png()
      .toFile(path.join(appDir, 'favicon-16.png'));

    console.log('\n✅ Favicon conversion complete!');
    console.log('\nFiles created:');
    console.log('  ✓ src/app/icon.png (512x512)');
    console.log('  ✓ src/app/apple-icon.png (180x180)');
    console.log('  ✓ public/icon-192.png (192x192)');
    console.log('  ✓ public/icon-512.png (512x512)');
    console.log('  ✓ src/app/favicon-16.png (16x16)');
    console.log('  ✓ src/app/favicon-32.png (32x32)');
    console.log('\n📝 Note: For favicon.ico, use favicon-32.png as it works in Next.js');
    console.log('   Or convert to ICO at: https://convertio.co/png-ico/');
    console.log('\n🚀 Restart your dev server and hard refresh (Ctrl+Shift+R)!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateFavicons();
