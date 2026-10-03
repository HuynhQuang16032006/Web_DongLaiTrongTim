"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ConfirmPaymentButton({ orderCode }: { orderCode: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    // In a real app, this might just notify the admin or poll for status.
    // For now, we simulate success message
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h4 className="text-xl font-bold text-warm-dark mb-2">Đã gửi yêu cầu!</h4>
        <p className="text-warm-brown text-sm mb-6 max-w-[250px]">
          Chúng tôi đang xử lý giao dịch. Email vé điện tử sẽ được gửi đến bạn ngay sau khi xác nhận thành công.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="text-warm-orange hover:text-warm-brown font-medium flex items-center gap-2"
        >
          Trở về trang chủ <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleConfirm}
      disabled={loading}
      className="w-full max-w-xs py-4 rounded-xl bg-warm-orange hover:bg-warm-brown text-white font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
    >
      {loading ? "Đang xử lý..." : "Tôi đã chuyển khoản"}
    </button>
  );
}
