import nodemailer from "nodemailer";
import QRCode from "qrcode";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTicketEmail(order: any) {
  // Generate QR Code for check-in (chỉ chứa mã vé)
  const qrData = order.orderCode;
  
  const qrCodeDataUrl = await QRCode.toDataURL(qrData);

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
          <p style="font-size: 14px; color: #8B5A33; margin-bottom: 10px;">Vui lòng xuất trình mã QR này tại cửa sự kiện để check-in:</p>
          <img src="cid:qrcode" alt="QR Code" style="width: 200px; height: 200px; border: 2px solid #C69774; border-radius: 10px; padding: 10px; background: white;" />
        </div>

        <h4 style="color: #8B5A33;">Thông tin sự kiện:</h4>
        <ul>
          <li><strong>Thời gian:</strong> 19:30 - 02/01/2027</li>
          <li><strong>Địa điểm:</strong> NOW Coffee and Tea (190 Trương Công Định, phường Tân Bình, HCM)</li>
        </ul>

        <p>Hẹn gặp bạn tại đêm nhạc!</p>
        <p>Thân mến,<br/><strong>Đọng Band</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: 'qrcode.png',
        content: qrCodeDataUrl.split("base64,")[1],
        encoding: 'base64',
        cid: 'qrcode' 
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}
