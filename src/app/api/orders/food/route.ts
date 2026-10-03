import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.json({ message: "Thiếu mã vé" }, { status: 400 });

  try {
    const order = await prisma.order.findUnique({
      where: { orderCode: code.toUpperCase() },
      include: { foodOrders: true }
    });

    if (!order) return NextResponse.json({ message: "Mã vé không hợp lệ" }, { status: 404 });
    if (order.status === "PENDING" || order.status === "EXPIRED") {
      return NextResponse.json({ message: "Vé chưa thanh toán hoặc chưa hợp lệ" }, { status: 400 });
    }

    let claimedDrinks = 0;
    order.foodOrders.forEach(fo => {
      if (fo.status !== "CANCELLED") {
        const items = JSON.parse(fo.items);
        items.forEach((item: any) => {
          claimedDrinks += item.quantity;
        });
      }
    });

    const availableFree = Math.max(0, order.checkedInCount - claimedDrinks);

    return NextResponse.json({
      customerName: order.customerName,
      ticketQuantity: order.ticketQuantity,
      checkedInCount: order.checkedInCount,
      claimedDrinks,
      availableFree
    });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { orderCode, tableNumber, items } = await req.json();

    if (!orderCode || !tableNumber || !items || items.length === 0) {
      return NextResponse.json({ message: "Vui lòng điền đủ thông tin bàn và chọn nước" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderCode: orderCode.toUpperCase() },
      include: { foodOrders: true }
    });

    if (!order) {
      return NextResponse.json({ message: "Không tìm thấy mã vé này" }, { status: 404 });
    }

    let claimedDrinks = 0;
    order.foodOrders.forEach(fo => {
      const pastItems = JSON.parse(fo.items);
      pastItems.forEach((item: any) => {
        claimedDrinks += item.quantity;
      });
    });

    const availableFree = Math.max(0, order.checkedInCount - claimedDrinks);

    let requestedQuantity = 0;
    items.forEach((item: any) => {
      requestedQuantity += item.quantity;
    });

    if (requestedQuantity > availableFree) {
      return NextResponse.json({ 
        message: `Lỗi: Với số lượng ${order.checkedInCount} người đã đến, bạn chỉ còn được chọn thêm ${availableFree} ly nước.` 
      }, { status: 400 });
    }

    const foodOrder = await prisma.foodOrder.create({
      data: {
        orderCode: orderCode.toUpperCase(),
        tableNumber,
        items: JSON.stringify(items),
        totalAmount: 0
      }
    });

    return NextResponse.json({ success: true, foodOrder }, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo đơn:", error);
    return NextResponse.json({ message: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
