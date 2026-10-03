import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTicketEmail } from "@/lib/email";

// Khóa bảo mật do bạn tự đặt trên cấu hình Webhook của SePay để xác thực
const SEPAY_WEBHOOK_TOKEN = process.env.SEPAY_WEBHOOK_TOKEN || "dongband-sepay-token";

export async function POST(req: Request) {
  try {
    // 1. Xác thực Webhook bằng Token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.includes(SEPAY_WEBHOOK_TOKEN)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Nhận dữ liệu từ SePay
    const body = await req.json();
    // Payload của SePay tham khảo: https://docs.sepay.vn/
    const { transferAmount, content, transferType } = body;

    // Chỉ xử lý giao dịch cộng tiền (tiền vào)
    if (transferType !== "in") {
      return NextResponse.json({ message: "Ignored" }, { status: 200 });
    }

    // 3. Trích xuất mã đơn hàng từ nội dung chuyển khoản (Ví dụ: DLTTABC123)
    // Dùng Regex để tìm mã bắt đầu bằng DLTT và theo sau là 6 ký tự
    const orderCodeMatch = content.match(/DLTT[a-zA-Z0-9]{6}/i);
    if (!orderCodeMatch) {
      return NextResponse.json({ message: "Không tìm thấy mã đơn hàng trong nội dung" }, { status: 200 });
    }

    const orderCode = orderCodeMatch[0].toUpperCase();

    // 4. Tìm đơn hàng trong hệ thống
    const order = await prisma.order.findUnique({
      where: { orderCode }
    });

    if (!order) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng trong hệ thống" }, { status: 200 });
    }

    if (order.status === "PAID") {
      return NextResponse.json({ message: "Đơn hàng đã được thanh toán trước đó" }, { status: 200 });
    }

    // 5. Kiểm tra số tiền chuyển có đủ không (Cho phép chuyển thừa, nhưng không được thiếu)
    if (Number(transferAmount) < order.totalAmount) {
      return NextResponse.json({ message: "Số tiền chuyển khoản không đủ" }, { status: 200 });
    }

    // 6. Kiểm tra xem đơn hàng đã hết hạn chưa (quá 10 phút)
    const now = new Date();
    const expiryTime = new Date(order.createdAt.getTime() + 10 * 60 * 1000);
    if (now > expiryTime) {
      // Nếu đã hết hạn nhưng khách vẫn cố tình chuyển khoản, 
      // hệ thống vẫn ghi nhận PAID (vì đã lỡ nhận tiền), Admin có thể hoàn tiền sau hoặc vẫn cho qua.
      // Ở đây ta vẫn cho qua để đảm bảo khách không bị mất tiền oan.
    }

    // 7. Cập nhật trạng thái thành PAID
    const updatedOrder = await prisma.order.update({
      where: { orderCode },
      data: { status: "PAID" }
    });

    // 8. Tự động gửi Email vé
    try {
      await sendTicketEmail(updatedOrder);
    } catch (e) {
      console.error("Gửi email vé thất bại:", e);
    }

    return NextResponse.json({ success: true, message: "Đã xác nhận thanh toán thành công" }, { status: 200 });

  } catch (error) {
    console.error("Lỗi xử lý webhook SePay:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
