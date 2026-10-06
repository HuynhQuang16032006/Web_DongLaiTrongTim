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

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { foodOrders: true } // Kéo kèm theo thông tin gọi món
    });
    
    const summary = await prisma.order.aggregate({
      where: { status: { in: ["PAID", "CHECKED_IN"] } },
      _sum: { ticketQuantity: true, donationAmount: true, totalAmount: true, checkedInCount: true }
    });

    const foodOrders = await prisma.foodOrder.findMany();
    const foodStats: Record<string, number> = {};
    foodOrders.forEach(fo => {
      try {
        const items = JSON.parse(fo.items);
        items.forEach((item: any) => {
          if (!foodStats[item.name]) foodStats[item.name] = 0;
          foodStats[item.name] += item.quantity;
        });
      } catch (e) {}
    });

    return NextResponse.json({ 
      orders, 
      summary: {
        ticketsSold: summary._sum.ticketQuantity || 0,
        totalDonations: summary._sum.donationAmount || 0,
        totalRevenue: summary._sum.totalAmount || 0,
        totalCheckedIn: summary._sum.checkedInCount || 0,
        foodStats
      } 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  }
}
