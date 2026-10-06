import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

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

// GET dùng để kiểm tra mã vé trước khi checkin (trả về tổng vé, đã checkin)
export async function GET(req: Request) {
  if (!isAuthenticated(req)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ message: "Thiếu mã vé" }, { status: 400 });

  try {
    const order = await prisma.order.findUnique({ where: { orderCode: code.toUpperCase() } });
    if (!order) return NextResponse.json({ message: "Không tìm thấy vé" }, { status: 404 });
    if (order.status === "PENDING" || order.status === "EXPIRED") {
      return NextResponse.json({ message: `Vé chưa thanh toán hoặc đã huỷ (${order.status})` }, { status: 400 });
    }

    return NextResponse.json({
      orderCode: order.orderCode,
      customerName: order.customerName,
      ticketQuantity: order.ticketQuantity,
      checkedInCount: order.checkedInCount,
      status: order.status
    });
  } catch (e) {
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderCode, checkinCount } = await req.json(); // checkinCount là SỐ LƯỢNG KHÁCH ĐẾN ĐỢT NÀY
    
    if (!orderCode || !checkinCount || checkinCount <= 0) {
      return NextResponse.json({ message: "Vui lòng nhập số lượng hợp lệ" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { orderCode: orderCode.toUpperCase() } });

    if (!order) return NextResponse.json({ message: "Không tìm thấy vé" }, { status: 404 });
    
    if (order.status === "PENDING" || order.status === "EXPIRED") {
      return NextResponse.json({ message: "Vé chưa thanh toán!" }, { status: 400 });
    }

    const availableToCheckin = order.ticketQuantity - order.checkedInCount;
    
    if (availableToCheckin <= 0) {
      return NextResponse.json({ message: "Mã vé này ĐÃ ĐƯỢC CHECK-IN đủ số lượng!" }, { status: 400 });
    }

    if (checkinCount > availableToCheckin) {
      return NextResponse.json({ message: `Mã vé này chỉ còn trống ${availableToCheckin} chỗ.` }, { status: 400 });
    }

    const newCheckedInCount = order.checkedInCount + checkinCount;
    const newStatus = newCheckedInCount === order.ticketQuantity ? "CHECKED_IN" : order.status; // Giữ nguyên PAID nếu chưa checkin hết

    const updatedOrder = await prisma.order.update({
      where: { orderCode: orderCode.toUpperCase() },
      data: { 
        checkedInCount: newCheckedInCount,
        status: newStatus 
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Check-in thành công ${checkinCount} khách cho đơn ${updatedOrder.customerName}. Đã checkin tổng cộng: ${newCheckedInCount}/${updatedOrder.ticketQuantity}` 
    }, { status: 200 });

  } catch (error) {
    console.error("Lỗi checkin:", error);
    return NextResponse.json({ message: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
