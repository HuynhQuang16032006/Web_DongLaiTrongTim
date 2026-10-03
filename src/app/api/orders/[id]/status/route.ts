import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    
    const order = await prisma.order.findUnique({
      where: { orderCode: id },
      select: { status: true, createdAt: true }
    });

    if (!order) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    // Kiểm tra hết hạn (10 phút = 600000 ms)
    const now = new Date();
    const expiryTime = new Date(order.createdAt.getTime() + 10 * 60 * 1000);
    
    if (order.status === "PENDING" && now > expiryTime) {
      // Cập nhật trạng thái thành EXPIRED nếu đã quá 10 phút
      await prisma.order.update({
        where: { orderCode: id },
        data: { status: "EXPIRED" }
      });
      return NextResponse.json({ status: "EXPIRED" });
    }

    return NextResponse.json({ status: order.status });
  } catch (error) {
    console.error("Lỗi kiểm tra trạng thái:", error);
    return NextResponse.json({ message: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
