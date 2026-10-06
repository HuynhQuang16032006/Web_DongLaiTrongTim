import nodemailer from "nodemailer";
import QRCode from "qrcode";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTicketEmail(order: any) {
  // Load custom font to support Vietnamese
  if (!GlobalFonts.has("GreatVibes")) {
    GlobalFonts.registerFromPath(path.join(process.cwd(), 'public', 'GreatVibes.ttf'), 'GreatVibes');
  }

  // Generate QR Code for check-in
  const qrData = order.orderCode;
  const qrBuffer = await QRCode.toBuffer(qrData, { margin: 1, width: 350 });
  const qrImage = await loadImage(qrBuffer);

  // Load ticket template
  const templatePath = path.join(process.cwd(), 'public', 'ticket-template.png');
  const templateImage = await loadImage(templatePath);

  const canvas = createCanvas(templateImage.width, templateImage.height);
  const ctx = canvas.getContext('2d');

  // Draw base ticket (transparent background preserved to avoid glow artifacts)
  ctx.drawImage(templateImage, 0, 0, templateImage.width, templateImage.height);

  // Configure text settings for Customer Name
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#b72522'; // Dark red matching the ticket
  ctx.font = '100px "GreatVibes"'; // Very soft, elegant cursive font
  
  // Shifted left slightly
  const textX = 2750;
  const textY = 675;
  ctx.fillText(order.customerName, textX, textY);

  // Draw QR code below address, shifted up and left
  const qrSize = 300;
  const qrX = 2783 - qrSize / 2; // Fixed QR center at 2783
  const qrY = 970; 
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  // Export to base64
  const ticketBuffer = canvas.toBuffer('image/png');
  const ticketBase64 = ticketBuffer.toString('base64');

  const mailOptions = {
    from: `"Đọng Band" <${process.env.SMTP_USER}>`,
    to: order.customerEmail,
    subject: `[Đọng Lại Trong Tim] Xác nhận đặt vé thành công - ${order.orderCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #3E2723; background-color: #FDFBF7; padding: 20px; border-radius: 10px;">
        <h2 style="color: #D47B4A; text-align: center;">Cảm ơn bạn đã ủng hộ Đọng Band!</h2>
        <p>Chào <strong>${order.customerName}</strong>,</p>
        <p>Chúng tôi đã nhận được thanh toán của bạn cho show diễn "Đọng Lại Trong Tim". Đây là thông tin vé của bạn:</p>
        
        <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #EAE0D5; margin: 20px 0;">
          <p><strong>Mã đơn hàng:</strong> ${order.orderCode}</p>
          <p><strong>Số lượng vé:</strong> ${order.ticketQuantity} vé</p>
          <p><strong>Số tiền vé:</strong> ${new Intl.NumberFormat('vi-VN').format(order.ticketQuantity * 89000)}đ</p>
          <p><strong>Quyên góp thêm:</strong> ${new Intl.NumberFormat('vi-VN').format(order.donationAmount)}đ</p>
          <hr style="border: 0; border-top: 1px solid #EAE0D5; margin: 10px 0;"/>
          <p><strong>Tổng cộng:</strong> <span style="color: #D47B4A; font-weight: bold; font-size: 18px;">${new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ</span></p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 14px; color: #8B5A33; margin-bottom: 10px;">Vui lòng lưu lại hình ảnh vé dưới đây và xuất trình mã QR tại cửa sự kiện để check-in:</p>
          <img src="cid:ticket" alt="Vé tham dự Đọng Lại Trong Tim" style="width: 100%; max-width: 600px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
        </div>

        <h4 style="color: #8B5A33;">Thông tin sự kiện:</h4>
        <ul>
          <li><strong>Thời gian:</strong> 16:00 - 31/01/2026</li>
          <li><strong>Địa điểm:</strong> NOW Coffee and Tea (190 Trương Công Định, phường Tân Bình, HCM)</li>
        </ul>

        <p>Hẹn gặp bạn tại đêm nhạc!</p>
        <p>Thân mến,<br/><strong>Đọng Band</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: 've-dong-lai-trong-tim.png',
        content: ticketBase64,
        encoding: 'base64',
        cid: 'ticket' 
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}

