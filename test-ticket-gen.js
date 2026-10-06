const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function test() {
  try {
    const templatePath = path.join(process.cwd(), 'public', 'ticket-template.png');
    const templateImage = await loadImage(templatePath);
    
    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#FDFBF7';
    ctx.fillRect(0, 0, templateImage.width, templateImage.height);

    ctx.drawImage(templateImage, 0, 0, templateImage.width, templateImage.height);
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#b72522'; 
    ctx.font = 'italic bold 70px sans-serif'; 
    
    const textX = 2845;
    const textY = 663;
    ctx.fillText('Nguyễn Chí Hải', textX, textY);
    
    const qrDataUrl = await QRCode.toDataURL('DLTT123456', { margin: 1, width: 300 });
    const qrImage = await loadImage(qrDataUrl);
    
    const qrSize = 300;
    const qrX = textX - qrSize / 2;
    const qrY = 1183 - qrSize / 2; 
    
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('test-ticket-output.png', buffer);
    console.log('Generated test-ticket-output.png');
  } catch(e) {
    console.error(e);
  }
}

test();
