"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket, Heart, Users, Calendar, MapPin, Loader2 } from "lucide-react";
import axios from "axios";

export default function TicketForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    quantity: 1,
    donation: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const ticketPrice = 89000;
  const totalAmount = formData.quantity * ticketPrice + Number(formData.donation || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await axios.post("/api/orders", {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        ticketQuantity: formData.quantity,
        donationAmount: Number(formData.donation || 0),
      });
      
      const { orderCode } = response.data;
      router.push(`/checkout/${orderCode}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-5 md:p-8 rounded-2xl shadow-xl border border-warm-sand/50">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-playfair font-bold text-warm-dark mb-2">Đặt Vé Tham Gia</h3>
        <p className="text-warm-brown text-sm">Cùng chung tay tạo nên những điều ý nghĩa</p>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
        {/* Thông tin cá nhân */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-dark mb-1">Họ và tên</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-warm-sand bg-warm-cream/50 focus:outline-none focus:ring-2 focus:ring-warm-orange/50 transition-all"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warm-dark mb-1">Số điện thoại</label>
              <input
                required
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-warm-sand bg-warm-cream/50 focus:outline-none focus:ring-2 focus:ring-warm-orange/50 transition-all"
                placeholder="09xx xxx xxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-dark mb-1">Email (để nhận vé)</label>
              <input
                required
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-warm-sand bg-warm-cream/50 focus:outline-none focus:ring-2 focus:ring-warm-orange/50 transition-all"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        <hr className="border-warm-sand" />

        {/* Thông tin vé & Quyên góp */}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-warm-cream rounded-xl border border-warm-sand">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warm-orange/10 flex items-center justify-center text-warm-orange">
                <Ticket size={20} />
              </div>
              <div>
                <p className="font-semibold text-warm-dark">Vé Sự Kiện</p>
                <p className="text-sm text-warm-brown">89.000đ / vé</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white border border-warm-sand flex items-center justify-center hover:bg-warm-sand/50 transition-colors"
                onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
              >-</button>
              
              <input 
                type="number" 
                min="1" 
                max="10"
                className="w-12 text-center font-medium bg-transparent border-b border-warm-sand focus:outline-none focus:border-warm-orange p-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={formData.quantity}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  if (val > 10) val = 10;
                  setFormData({ ...formData, quantity: val });
                }}
              />

              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white border border-warm-sand flex items-center justify-center hover:bg-warm-sand/50 transition-colors"
                onClick={() => setFormData({ ...formData, quantity: Math.min(10, formData.quantity + 1) })}
              >+</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-dark mb-2 flex items-center gap-2">
              <Heart size={16} className="text-red-400" />
              Quyên góp thêm (Tùy tâm)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1000"
                className="w-full px-4 py-3 rounded-xl border border-warm-sand bg-warm-cream/50 focus:outline-none focus:ring-2 focus:ring-warm-orange/50 transition-all"
                placeholder="Nhập số tiền..."
                value={formData.donation || ""}
                onChange={(e) => setFormData({ ...formData, donation: parseInt(e.target.value) || 0 })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-brown font-medium">VNĐ</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Tổng kết */}
        <div className="pt-4 border-t border-warm-sand">
          <div className="flex justify-between items-end mb-6">
            <span className="text-warm-brown">Tổng cộng:</span>
            <span className="text-3xl font-bold text-warm-dark">
              {new Intl.NumberFormat('vi-VN').format(totalAmount)}đ
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-warm-orange hover:bg-warm-brown text-white font-semibold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Tiến hành thanh toán"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
