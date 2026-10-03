"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Check, MailCheck, LogOut, Loader2, AlertCircle, QrCode, Coffee, Users, CheckCircle2 } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<{ orders: any[], summary: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/admin/orders");
      setData(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/admin");
      } else {
        setError("Lỗi tải dữ liệu");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmPayment = async (orderId: string) => {
    if (!confirm("Xác nhận đã nhận tiền và gửi vé cho đơn hàng này?")) return;
    
    try {
      await axios.post(`/api/admin/orders/${orderId}/confirm`);
      fetchData();
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể xác nhận"));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-warm-cream"><Loader2 className="animate-spin text-warm-orange w-8 h-8" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-warm-cream text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-warm-cream p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-warm-dark">Dashboard</h1>
            <p className="text-warm-brown text-sm">Quản lý đặt vé Đọng Lại Trong Tim</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/checkin" className="flex items-center gap-2 px-4 py-2 bg-warm-orange rounded-lg text-white font-medium hover:bg-warm-brown transition-colors shadow-sm">
              <QrCode size={16} /> Check-in Vé
            </Link>
            <Link href="/admin/kitchen" className="flex items-center gap-2 px-4 py-2 bg-warm-dark rounded-lg text-white font-medium hover:bg-black transition-colors shadow-sm">
              <Coffee size={16} /> Quầy nước / Bếp
            </Link>
            <button 
              onClick={() => {
                document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                router.push("/admin");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-warm-sand text-warm-dark hover:bg-warm-sand/30 transition-colors shadow-sm"
            >
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-sand">
            <p className="text-warm-brown text-sm font-medium mb-1">Tổng vé đã bán</p>
            <p className="text-3xl font-bold text-warm-dark">{data?.summary?.ticketsSold} / 100</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-sand">
            <p className="text-warm-brown text-sm font-medium mb-1">Khách đã đến (Checkin)</p>
            <p className="text-3xl font-bold text-blue-600">{data?.summary?.totalCheckedIn} / {data?.summary?.ticketsSold}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-sand">
            <p className="text-warm-brown text-sm font-medium mb-1">Tổng tiền quyên góp</p>
            <p className="text-3xl font-bold text-warm-orange-light">{new Intl.NumberFormat('vi-VN').format(data?.summary?.totalDonations || 0)}đ</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-sand">
            <p className="text-warm-brown text-sm font-medium mb-1">Tổng doanh thu</p>
            <p className="text-3xl font-bold text-green-600">{new Intl.NumberFormat('vi-VN').format(data?.summary?.totalRevenue || 0)}đ</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-warm-sand overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-warm-sand/30 text-warm-dark font-medium border-b border-warm-sand">
                <tr>
                  <th className="p-4">Mã vé</th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Thông tin liên hệ</th>
                  <th className="p-4">Chi tiết vé</th>
                  <th className="p-4">Trạng thái Checkin</th>
                  <th className="p-4">Gọi món</th>
                  <th className="p-4">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-sand/50">
                {data?.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-warm-cream/30 transition-colors">
                    <td className="p-4 font-mono font-medium text-warm-dark">{order.orderCode}</td>
                    <td className="p-4 font-medium">{order.customerName}</td>
                    <td className="p-4">
                      <div className="text-warm-dark">{order.customerPhone}</div>
                      <div className="text-warm-brown text-xs">{order.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-warm-dark">{order.ticketQuantity} vé</div>
                      <div className="text-green-600 font-bold mt-1 text-xs">
                        {new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2 items-start">
                        {order.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <AlertCircle size={12} /> Chờ thanh toán
                          </span>
                        )}
                        {order.status === "PAID" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            <Check size={12} /> Đã thanh toán
                          </span>
                        )}
                        {order.status === "CHECKED_IN" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            <CheckCircle2 size={12} /> Check-in toàn bộ
                          </span>
                        )}
                        
                        {(order.status === "PAID" || order.status === "CHECKED_IN") && order.checkedInCount > 0 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-warm-orange/10 text-warm-orange-light border border-warm-orange/20">
                            <Users size={12} /> Đã đến {order.checkedInCount}/{order.ticketQuantity}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {order.foodOrders && order.foodOrders.length > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          <Coffee size={12} /> Đã gọi {order.foodOrders.reduce((sum: number, fo: any) => {
                            const items = JSON.parse(fo.items);
                            return sum + items.reduce((s: number, i: any) => s + i.quantity, 0);
                          }, 0)} món
                        </span>
                      ) : (
                        <span className="text-warm-brown text-xs">Chưa gọi</span>
                      )}
                    </td>
                    <td className="p-4">
                      {order.status === "PENDING" && (
                        <button
                          onClick={() => confirmPayment(order.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-orange text-white rounded-lg text-xs font-medium hover:bg-warm-brown transition-colors"
                        >
                          <MailCheck size={14} /> Xác nhận tiền
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {data?.orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-warm-brown">Chưa có đơn hàng nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
