import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({ params }: { params: { orderCode: string } }) {
  const { orderCode } = await params;
  
  const order = await prisma.order.findUnique({
    where: { orderCode },
  });

  if (!order) {
    return notFound();
  }

  // Chuyển order thành dữ liệu thuần để pass qua Client Component
  const orderData = {
    orderCode: order.orderCode,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
  };

  return (
    <main className="min-h-screen bg-warm-cream py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          <CheckoutClient order={orderData} />
        </div>
      </div>
    </main>
  );
}
