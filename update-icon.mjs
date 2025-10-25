import pngToIco from 'png-to-ico';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateIcon() {
    try {
        console.log('\n🎬 Updating Frame Splitter Icon...\n');
        
        // The movie reel logo should be saved as 'movie-reel-logo.png'
        // or use the existing 'Image spltter.png'
        const possibleLogos = [
            'movie-reel-logo.png',
            'frame-splitter-logo.png', 
            'logo.png',
            'Image spltter.png'
        ];
        
        let inputPng = null;
        for (const logo of possibleLogos) {
            const fullPath = path.join(__dirname, logo);
            if (fs.existsSync(fullPath)) {
                inputPng = fullPath;
                console.log(`✓ Found logo: ${logo}`);
                break;
            }
        }
        
        if (!inputPng) {
            console.error('❌ No logo image found!');
            console.log('\n📋 Please save your movie reel image as one of:');
            possibleLogos.forEach(name => console.log(`   - ${name}`));
            console.log('\n💡 You can drag and drop the image into this folder and rename it.');
            return;
        }
        
        console.log('📐 Creating icon in multiple sizes...');
        
        // Create multiple sizes for better icon quality
        const sizes = [16, 32, 48, 64, 128, 256];
        const tempFiles = [];
        
        for (const size of sizes) {
            const tempFile = path.join(__dirname, `temp-icon-${size}.png`);
            await sharp(inputPng)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
                })
                .png()
                .toFile(tempFile);
            tempFiles.push(tempFile);
            console.log(`   ✓ Created ${size}x${size}`);
        }
        
        console.log('\n🔄 Converting to ICO format...');
        
        // Convert all PNGs to single ICO file
        const buf = await pngToIco(tempFiles);
        
        // Write to project root
        fs.writeFileSync(path.join(__dirname, 'icon.ico'), buf);
        console.log('   ✓ Created icon.ico');
        
        // Also write to build/icon.ico for electron-builder
        const buildDir = path.join(__dirname, 'build');
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir);
            console.log('   ✓ Created build/ directory');
        }
        fs.writeFileSync(path.join(buildDir, 'icon.ico'), buf);
        console.log('   ✓ Created build/icon.ico');
        
        // Clean up temp files
        console.log('\n🧹 Cleaning up temporary files...');
        tempFiles.forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
        console.log('   ✓ Cleaned up');
        
        console.log('\n✅ Icon updated successfully!\n');
        console.log('📍 Icon files created:');
        console.log('   - icon.ico (project root)');
        console.log('   - build/icon.ico (for electron-builder)');
        console.log('\n📋 Next steps:');
        console.log('   1. npm run build:win');
        console.log('   2. Install the new Setup.exe');
        console.log('   3. Your desktop icon will show the movie reel! 🎬\n');
        
    } catch (err) {
        console.error('\n❌ Error creating icon:', err.message);
        console.log('\n💡 Make sure sharp and png-to-ico are installed:');
        console.log('   npm install sharp png-to-ico\n');
    }
}

updateIcon();
