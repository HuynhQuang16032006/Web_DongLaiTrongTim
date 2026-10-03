import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // Tìm order để lấy orderCode
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    // Phải xóa các đơn nước gắn với vé này trước bằng orderCode
    await prisma.foodOrder.deleteMany({
      where: { orderCode: order.orderCode }
    });

    // Xóa vé chính
    await prisma.order.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi xóa đơn hàng:", error);
    return NextResponse.json({ message: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
