import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { sendTicketEmail } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "dongband-secret-key-2027";

function isAuthenticated(req: Request) {
  const token = req.headers.get("cookie")?.split("admin_token=")[1]?.split(";")[0];
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (e) {
    return false;
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    if (order.status === "PAID") {
      return NextResponse.json({ message: "Đơn hàng đã được xác nhận trước đó" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: "PAID" },
    });

    // Send confirmation email
    try {
      await sendTicketEmail(updatedOrder);
    } catch (emailError) {
      console.error("Gửi email thất bại:", emailError);
      // We still return success but maybe note that email failed
    }

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error("Lỗi xác nhận đơn hàng:", error);
    return NextResponse.json({ message: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
