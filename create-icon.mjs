import pngToIco from 'png-to-ico';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createIcon() {
    try {
        console.log('Converting JPG to PNG...');
        
        // First convert JPG to PNG
        const tempPngPath = path.join(__dirname, 'temp-icon.png');
        await sharp(path.join(__dirname, 'iamge-splitter-logo.jpg'))
            .resize(256, 256)
            .png()
            .toFile(tempPngPath);
        
        console.log('Converting PNG to ICO...');
        
        // Then convert PNG to ICO
        const buf = await pngToIco(tempPngPath);
        
        fs.writeFileSync(path.join(__dirname, 'icon.ico'), buf);
        
        // Clean up temp file
        fs.unlinkSync(tempPngPath);
        
        console.log('✅ Icon created successfully: icon.ico');
    } catch (err) {
        console.error('❌ Error creating icon:', err);
    }
}

createIcon();
