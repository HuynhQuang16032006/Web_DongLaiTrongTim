const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function test() {
  try {
    const templatePath = path.join(process.cwd(), 'public', 'ticket-template.png');
    const image = await loadImage(templatePath);
    
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Draw base image
    ctx.drawImage(image, 0, 0, image.width, image.height);
    
    // Write name
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#b72522'; // Approximate dark red color from original image
    
    // We can use Arial or similar if custom font isn't loaded
    ctx.font = 'italic bold 90px "Times New Roman"';
    
    const textX = 2770;
    const textY = 875;
    ctx.fillText('Nguyễn Chí Hải', textX, textY);
    
    // Generate QR
    const qrDataUrl = await QRCode.toDataURL('DLTT123456', { margin: 1, width: 300 });
    const qrImage = await loadImage(qrDataUrl);
    
    const qrSize = 350;
    const qrX = textX - qrSize / 2;
    const qrY = 1200; // below address
    
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    
    // Output
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('test-ticket-output.png', buffer);
    console.log('Generated test-ticket-output.png');
  } catch(e) {
    console.error(e);
  }
}

test();
