"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import CopyButton from "./CopyButton";
import axios from "axios";

interface OrderData {
  orderCode: string;
  totalAmount: number;
  createdAt: Date;
}

export default function CheckoutClient({ order }: { order: OrderData }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [status, setStatus] = useState<"PENDING" | "PAID" | "EXPIRED">("PENDING");

  const bankName = "MB Bank";
  const accNo = "6070607062006";
  const accName = "HUYNH NHAT QUANG";
  const amount = order.totalAmount;
  const qrUrl = `https://img.vietqr.io/image/MB-${accNo}-compact2.png?amount=${amount}&addInfo=${order.orderCode}&accountName=${encodeURIComponent(accName)}`;

  // Polling & Countdown logic
  useEffect(() => {
    // 1. Countdown timer
    const endTime = new Date(order.createdAt).getTime() + 10 * 60 * 1000;
    
    const countdownInterval = setInterval(() => {
      if (status !== "PENDING") return;
      
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft(0);
        setStatus("EXPIRED");
        clearInterval(countdownInterval);
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    }, 1000);

    // 2. Polling API
    const pollingInterval = setInterval(async () => {
      if (status !== "PENDING") return;
      
      try {
        const res = await axios.get(`/api/orders/${order.orderCode}/status`);
        if (res.data.status === "PAID") {
          setStatus("PAID");
        } else if (res.data.status === "EXPIRED") {
          setStatus("EXPIRED");
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(countdownInterval);
      clearInterval(pollingInterval);
    };
  }, [order.createdAt, order.orderCode, status]);

  // Format time left
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (status === "PAID") {
    return (
      <div className="flex-1 p-8 md:p-12 bg-white flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-playfair font-bold text-warm-dark mb-4">Thanh toán thành công!</h2>
        <p className="text-warm-brown mb-8 max-w-md">
          Hệ thống đã nhận được tiền và tự động duyệt đơn hàng. Email vé điện tử (E-Ticket) đã được gửi đến email của bạn. Vui lòng kiểm tra Hộp thư đến (hoặc Spam).
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-warm-orange hover:bg-warm-brown text-white font-medium rounded-full transition-colors flex items-center gap-2"
        >
          Quay lại trang chủ <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  if (status === "EXPIRED") {
    return (
      <div className="flex-1 p-8 md:p-12 bg-white flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <XCircle size={40} />
        </div>
        <h2 className="text-3xl font-playfair font-bold text-warm-dark mb-4">Mã thanh toán đã hết hạn</h2>
        <p className="text-warm-brown mb-8 max-w-md">
          Thời gian thanh toán (10 phút) đã kết thúc. Nếu bạn vẫn muốn mua vé, vui lòng quay lại trang chủ và đặt lại vé mới.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-warm-dark hover:bg-black text-white font-medium rounded-full transition-colors flex items-center gap-2"
        >
          Đặt vé mới <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // PENDING Status
  return (
    <>
      {/* Trái: Thông tin chuyển khoản */}
      <div className="flex-1 p-6 md:p-12 bg-warm-dark text-white flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 bg-warm-orange/20 text-warm-orange-light px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
            <Loader2 size={16} className="animate-spin" />
            Đang chờ thanh toán...
          </div>
          <h1 className="text-3xl font-playfair font-bold mb-2">Thanh toán đơn hàng</h1>
          <p className="text-warm-cream/70 mb-8">
            Vui lòng mở App Ngân hàng và quét mã QR bên phải. Hệ thống sẽ tự động duyệt trong vài giây sau khi chuyển khoản.
          </p>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-warm-cream/50 mb-1">Mã đơn hàng / Nội dung chuyển khoản</p>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 overflow-hidden">
                <span className="font-mono text-xl font-bold tracking-wider truncate mr-2">{order.orderCode}</span>
                <CopyButton text={order.orderCode} />
              </div>
            </div>

            <div>
              <p className="text-sm text-warm-cream/50 mb-1">Số tiền thanh toán</p>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-2xl font-bold text-warm-orange-light truncate mr-2">
                  {new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ
                </span>
                <CopyButton text={order.totalAmount.toString()} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-2 text-sm text-warm-cream/50">
          <p>Ngân hàng: <strong>{bankName}</strong></p>
          <p>Số tài khoản: <strong>{accNo}</strong></p>
          <p>Chủ tài khoản: <strong>{accName}</strong></p>
        </div>
      </div>

      {/* Phải: Mã QR */}
      <div className="flex-1 p-6 md:p-12 bg-white flex flex-col items-center justify-center relative">
        {/* Countdown */}
        <div className="relative md:absolute md:top-8 md:right-8 mb-6 md:mb-0 flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full font-mono font-medium border border-red-100 self-end md:self-auto">
          <Clock size={16} />
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <h3 className="text-lg font-medium text-warm-dark mb-6 text-center md:mt-12">Quét mã QR qua ứng dụng ngân hàng</h3>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-warm-sand mb-8 w-full max-w-[300px]">
          <Image 
            src={qrUrl} 
            alt="QR Code" 
            width={300} 
            height={300} 
            className="rounded-xl w-full h-auto"
            unoptimized
          />
        </div>
        
        <p className="text-center text-sm text-warm-brown max-w-xs flex flex-col items-center gap-2">
          <span>Giữ nguyên màn hình này. Hệ thống đang tự động kiểm tra giao dịch liên tục.</span>
        </p>
      </div>
    </>
  );
}
