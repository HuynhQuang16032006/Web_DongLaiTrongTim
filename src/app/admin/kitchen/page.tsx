"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Coffee, CheckCircle2, ArrowLeft, Loader2, Utensils, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/admin/kitchen");
      setOrders(res.data);
    } catch (e: any) {
      if (e.response?.status === 401) window.location.href = "/admin";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Tự động load mỗi 5s
    return () => clearInterval(interval);
  }, []);

  const markDelivered = async (id: string) => {
    try {
      await axios.post("/api/admin/kitchen", { id });
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (e) {
      alert("Lỗi cập nhật!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-warm-orange w-8 h-8" /></div>;

  return (
    <div className="min-h-screen bg-warm-cream p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 bg-white rounded-full shadow-sm text-warm-dark hover:bg-warm-sand">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-playfair font-bold text-warm-dark">Quầy Bar / Bếp</h1>
              <p className="text-warm-brown text-sm">Quản lý gọi món tại bàn</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border border-warm-sand flex items-center gap-2 font-medium text-warm-orange">
            <Utensils size={16} /> Đang chờ: {orders.length} đơn
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const items = JSON.parse(order.items);
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-warm-sand overflow-hidden flex flex-col">
                <div className="bg-warm-dark text-white p-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Bàn {order.tableNumber}</h3>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/90">
                    Mã vé: {order.orderCode}
                  </span>
                </div>
                
                <div className="p-4 flex-1">
                  <p className="text-sm text-warm-brown mb-4 flex items-center gap-1">
                    <Clock size={14} /> 
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: vi })}
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Chờ làm</span>
                  </p>

                  <ul className="space-y-3 mb-6">
                    {items.map((item: any, idx: number) => (
                      <li key={idx} className="flex justify-between items-center pb-2 border-b border-warm-sand/50 last:border-0">
                        <span className="font-medium text-warm-dark">{item.name}</span>
                        <span className="font-bold text-warm-orange">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 pt-0">
                  <button 
                    onClick={() => markDelivered(order.id)}
                    className="w-full py-3 bg-warm-orange hover:bg-green-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} /> Đã giao xong
                  </button>
                </div>
              </div>
            );
          })}

          {orders.length === 0 && (
            <div className="col-span-full py-20 text-center text-warm-brown flex flex-col items-center justify-center">
              <Coffee size={48} className="text-warm-sand mb-4" />
              <p className="text-xl font-medium">Chưa có đơn món nào</p>
              <p className="text-sm">Hãy nghỉ ngơi một chút, các đơn mới sẽ hiện ở đây.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
