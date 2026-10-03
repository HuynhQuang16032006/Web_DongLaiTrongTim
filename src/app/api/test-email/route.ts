import { NextResponse } from "next/server";
import { sendTicketEmail } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const mockOrder = {
      orderCode: "TEST123456",
      customerName: "Nguyễn Văn A",
      customerEmail: "dongband2025@gmail.com",
      ticketQuantity: 2,
      donationAmount: 0,
      totalAmount: 178000
    };
    
    await sendTicketEmail(mockOrder);
    return NextResponse.json({ success: true, message: "Email sent" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
