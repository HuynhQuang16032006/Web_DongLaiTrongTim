import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerEmail, ticketQuantity, donationAmount } = body;

    if (!customerName || !customerPhone || !customerEmail || !ticketQuantity) {
      return NextResponse.json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc" }, { status: 400 });
    }

    // Check ticket limit (max 100)
    const ticketPrice = 89000;
    const totalAmount = (ticketQuantity * ticketPrice) + Number(donationAmount || 0);

    const currentOrders = await prisma.order.aggregate({
      _sum: { ticketQuantity: true },
      where: { status: { not: "CANCELLED" } }
    });

    const currentSold = currentOrders._sum.ticketQuantity || 0;
    if (currentSold + ticketQuantity > 100) {
      return NextResponse.json({ message: `Chỉ còn lại ${Math.max(0, 100 - currentSold)} vé.` }, { status: 400 });
    }

    // Generate unique order code: DLTT + 6 random alphanumeric characters
    const uniqueId = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderCode = `DLTT${uniqueId}`;

    const order = await prisma.order.create({
      data: {
        orderCode,
        customerName,
        customerPhone,
        customerEmail,
        ticketQuantity: Number(ticketQuantity),
        ticketPrice,
        donationAmount: Number(donationAmount || 0),
        totalAmount,
      }
    });

    return NextResponse.json({ orderCode: order.orderCode }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ message: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
